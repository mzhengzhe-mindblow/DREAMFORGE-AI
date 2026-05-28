const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
const dataDir = process.env.DREAMFORGE_DATA_DIR || path.join(root, "data");
const usersFile = path.join(dataDir, "users.json");
const outboxFile = path.join(dataDir, "email-outbox.json");
const oauthStatesFile = path.join(dataDir, "oauth-states.json");
const marketingNewsFile = path.join(dataDir, "marketing-news.json");
const adminFile = path.join(dataDir, "admin.json");
const adminSettingsFile = path.join(dataDir, "admin-settings.json");
const adminSessions = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const providerHosts = {
  openai: "https://api.openai.com/v1/models",
  stability: "https://api.stability.ai/v1/user/balance",
  fal: "https://fal.run/fal-ai/flux/dev",
  replicate: "https://api.replicate.com/v1/account",
  google: "https://generativelanguage.googleapis.com/v1beta/models",
  ideogram: "https://api.ideogram.ai/v1/models",
  leonardo: "https://cloud.leonardo.ai/api/rest/v1/me",
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, payload) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(payload, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return { salt, hash };
}

function safeUser(user) {
  return {
    email: user.email,
    name: user.name,
    provider: user.provider,
    verified: user.verified,
  };
}

function sanitizeAdminSettings(settings = {}) {
  return {
    keys: settings.keys || {},
    videoApiKeys: settings.videoApiKeys || {},
    videoEndpoints: settings.videoEndpoints || {},
    videoEndpoint: settings.videoEndpoint || "",
    byteplusEndpoint: settings.byteplusEndpoint || "",
    byteplusWorkspaceId: settings.byteplusWorkspaceId || "",
    webhook: settings.webhook || "",
    imageProvider: settings.imageProvider || "",
    imageModel: settings.imageModel || "",
    videoProvider: settings.videoProvider || "",
    videoModel: settings.videoModel || "",
  };
}

function createAdminToken() {
  const token = crypto.randomBytes(32).toString("hex");
  adminSessions.set(token, Date.now() + 12 * 60 * 60 * 1000);
  return token;
}

function requireAdmin(req) {
  const token = String(req.headers["x-admin-token"] || "").trim();
  const expiresAt = adminSessions.get(token);
  if (!token || !expiresAt || expiresAt < Date.now()) {
    adminSessions.delete(token);
    throw new Error("Admin 登录已过期，请重新登录");
  }
  adminSessions.set(token, Date.now() + 12 * 60 * 60 * 1000);
}

async function adminStatus() {
  const admin = await readJson(adminFile, null);
  return { configured: Boolean(admin?.passwordHash?.hash) };
}

async function adminLogin(body) {
  const password = String(body.password || "");
  if (password.length < 8) throw new Error("Admin 密码至少 8 位");
  const admin = await readJson(adminFile, null);
  if (!admin?.passwordHash?.hash) {
    const passwordHash = hashPassword(password);
    await writeJson(adminFile, {
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { token: createAdminToken(), firstSetup: true };
  }
  const passwordHash = hashPassword(password, admin.passwordHash.salt);
  if (passwordHash.hash !== admin.passwordHash.hash) throw new Error("Admin 密码不正确");
  return { token: createAdminToken(), firstSetup: false };
}

async function readAdminSettings() {
  return sanitizeAdminSettings(await readJson(adminSettingsFile, {}));
}

async function saveAdminSettings(payload) {
  const settings = sanitizeAdminSettings(payload || {});
  await writeJson(adminSettingsFile, {
    ...settings,
    updatedAt: new Date().toISOString(),
  });
  return settings;
}

async function withAdminApiSettings(input = {}) {
  const settings = await readAdminSettings();
  const next = { ...input };
  const provider = next.provider || next.videoProvider || next.imageProvider || "";
  if (!next.openaiKey && settings.keys.openai) next.openaiKey = settings.keys.openai;
  if (!next.apiKey && provider) {
    next.apiKey = settings.videoApiKeys[provider] || settings.keys[provider] || "";
  }
  if ((provider === "byteplus" || next.taskId || /seedance|byteplus/i.test(String(next.model || ""))) && !next.apiKey) {
    next.apiKey = settings.videoApiKeys.byteplus || settings.keys.byteplus || "";
  }
  if (!next.endpoint && provider) {
    next.endpoint = settings.videoEndpoints[provider] || "";
  }
  if ((provider === "byteplus" || next.taskId || /seedance|byteplus/i.test(String(next.model || ""))) && !next.endpoint) {
    next.endpoint = settings.videoEndpoints.byteplus || settings.byteplusEndpoint || "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks";
  }
  if (!next.webhook && settings.webhook) next.webhook = settings.webhook;
  if (!next.workspaceId && settings.byteplusWorkspaceId) next.workspaceId = settings.byteplusWorkspaceId;
  return next;
}

function getOrigin(req) {
  return `http://${req.headers.host || `${host}:${port}`}`;
}

async function saveVerificationEmail(user, token, req) {
  const origin = getOrigin(req);
  const verificationLink = `${origin}/api/auth/verify?token=${encodeURIComponent(token)}`;
  const outbox = await readJson(outboxFile, []);
  outbox.unshift({
    to: user.email,
    subject: "Verify your DreamForge account",
    verificationLink,
    createdAt: new Date().toISOString(),
  });
  await writeJson(outboxFile, outbox.slice(0, 50));
  return verificationLink;
}

function googleOAuthConfig(req) {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI || `${getOrigin(req)}/api/auth/google/callback`,
  };
}

async function createGoogleOAuthRedirect(req) {
  const config = googleOAuthConfig(req);
  if (!config.clientId || !config.clientSecret) {
    throw new Error("Google OAuth 尚未配置。请设置 GOOGLE_CLIENT_ID 和 GOOGLE_CLIENT_SECRET 后重启本地后端。");
  }
  const state = crypto.randomBytes(24).toString("hex");
  const states = await readJson(oauthStatesFile, []);
  states.unshift({ state, createdAt: Date.now() });
  await writeJson(oauthStatesFile, states.slice(0, 20));
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function handleGoogleCallback(req) {
  const url = new URL(req.url, getOrigin(req));
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) throw new Error("Google 授权回调缺少 code 或 state");

  const states = await readJson(oauthStatesFile, []);
  const stateIndex = states.findIndex((item) => item.state === state && Date.now() - item.createdAt < 10 * 60 * 1000);
  if (stateIndex < 0) throw new Error("Google 授权状态已过期，请重新连接 Gmail");
  states.splice(stateIndex, 1);
  await writeJson(oauthStatesFile, states);

  const config = googleOAuthConfig(req);
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) throw new Error(tokenData.error_description || tokenData.error || "Google token 交换失败");

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profile = await userResponse.json();
  if (!userResponse.ok || !profile.email) throw new Error(profile.error_description || "无法读取 Google 账户资料");
  if (profile.email_verified === false) throw new Error("这个 Google 邮箱尚未验证");

  const users = await readJson(usersFile, []);
  const existing = users.find((user) => user.email === profile.email.toLowerCase());
  if (existing && existing.provider !== "gmail") {
    throw new Error("这个邮箱已经用 Email 注册，请使用 Email 登录或换一个 Gmail");
  }
  const user = {
    ...(existing || {}),
    email: profile.email.toLowerCase(),
    name: profile.name || profile.email.split("@")[0],
    provider: "gmail",
    verified: true,
    googleId: profile.sub,
    avatar: profile.picture || "",
    updatedAt: new Date().toISOString(),
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  const nextUsers = existing ? users.map((item) => (item.email === user.email ? user : item)) : [...users, user];
  await writeJson(usersFile, nextUsers);
  return safeUser(user);
}

async function registerUser(body, req) {
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const provider = "email";
  const name = String(body.name || "").trim() || email.split("@")[0];
  if (!email.includes("@")) throw new Error("邮箱格式不正确");
  if (password.length < 6) throw new Error("密码至少 6 位");

  const users = await readJson(usersFile, []);
  const existing = users.find((user) => user.email === email);
  if (existing) throw new Error("这个邮箱已经注册，请直接登录");

  const passwordHash = hashPassword(password);
  const user = {
    email,
    name,
    provider,
    passwordHash,
    verified: true,
    verificationToken: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const nextUsers = [...users, user];
  await writeJson(usersFile, nextUsers);
  return { user: safeUser(user) };
}

async function loginUser(body) {
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const provider = "email";
  const users = await readJson(usersFile, []);
  const user = users.find((item) => item.email === email);
  if (!user) throw new Error("本机没有找到这个账户，请先注册");
  if (user.provider !== provider) throw new Error(`这个账户是用 ${user.provider} 方式注册的`);
  const passwordHash = hashPassword(password, user.passwordHash.salt);
  if (passwordHash.hash !== user.passwordHash.hash) throw new Error("密码不正确");
  return { user: safeUser(user) };
}

async function resendVerification(body, req) {
  const email = String(body.email || "").trim().toLowerCase();
  const users = await readJson(usersFile, []);
  const user = users.find((item) => item.email === email);
  if (!user) throw new Error("本机没有找到这个账户");
  if (user.verified) throw new Error("这个账户已经验证过了");
  user.verificationToken = crypto.randomBytes(24).toString("hex");
  user.updatedAt = new Date().toISOString();
  await writeJson(usersFile, users);
  const verificationLink = await saveVerificationEmail(user, user.verificationToken, req);
  return { verificationLink };
}

async function changePassword(body) {
  const email = String(body.email || "").trim().toLowerCase();
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  if (!email.includes("@")) throw new Error("邮箱格式不正确");
  if (newPassword.length < 6) throw new Error("新密码至少 6 位");

  const users = await readJson(usersFile, []);
  const user = users.find((item) => item.email === email);
  if (!user) throw new Error("本机没有找到这个账户");
  const currentHash = hashPassword(currentPassword, user.passwordHash.salt);
  if (currentHash.hash !== user.passwordHash.hash) throw new Error("当前密码不正确");
  user.passwordHash = hashPassword(newPassword);
  user.updatedAt = new Date().toISOString();
  await writeJson(usersFile, users);
  return { user: safeUser(user) };
}

async function deleteAccount(body) {
  const email = String(body.email || "").trim().toLowerCase();
  if (!email.includes("@")) throw new Error("邮箱格式不正确");
  if (body.confirm !== "DELETE") throw new Error("请输入 DELETE 后再删除账户");
  const users = await readJson(usersFile, []);
  const nextUsers = users.filter((user) => user.email !== email);
  if (nextUsers.length === users.length) throw new Error("本机没有找到这个账户");
  await writeJson(usersFile, nextUsers);
  return { deleted: true };
}

async function verifyUser(token) {
  const users = await readJson(usersFile, []);
  const user = users.find((item) => item.verificationToken === token);
  if (!user) return false;
  user.verified = true;
  user.verificationToken = "";
  user.updatedAt = new Date().toISOString();
  await writeJson(usersFile, users);
  return true;
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    let tooLarge = false;
    req.on("data", (chunk) => {
      if (tooLarge) return;
      body += chunk;
      if (body.length > 32_000_000) {
        tooLarge = true;
        reject(new Error("请求太大。参考图已超过本地可转发给 Seedance REST API 的容量，请裁剪或换一张更小的图片。"));
      }
    });
    req.on("end", () => {
      if (tooLarge) return;
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON 格式不正确"));
      }
    });
  });
}

async function asDataUrl(response) {
  const type = response.headers.get("content-type") || "";
  if (type.startsWith("image/")) {
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:${type.split(";")[0]};base64,${bytes.toString("base64")}`;
  }
  const data = await response.json();
  if (data?.data?.[0]?.b64_json) return `data:image/png;base64,${data.data[0].b64_json}`;
  if (data?.data?.[0]?.url) return data.data[0].url;
  if (data?.artifacts?.[0]?.base64) return `data:image/png;base64,${data.artifacts[0].base64}`;
  if (data?.images?.[0]?.url) return data.images[0].url;
  if (Array.isArray(data?.output) && data.output[0]) return data.output[0];
  const inline = data?.candidates?.[0]?.content?.parts?.find((part) => part.inlineData || part.inline_data);
  if (inline) {
    const image = inline.inlineData || inline.inline_data;
    return `data:${image.mimeType || image.mime_type || "image/png"};base64,${image.data}`;
  }
  if (data?.sdGenerationJob?.generationId) {
    return {
      pending: true,
      message: `Leonardo 已创建任务：${data.sdGenerationJob.generationId}`,
    };
  }
  throw new Error(data?.error?.message || data?.message || "服务商没有返回图片");
}

async function asVideoDataUrl(response) {
  const type = response.headers.get("content-type") || "video/mp4";
  const bytes = Buffer.from(await response.arrayBuffer());
  return `data:${type.split(";")[0] || "video/mp4"};base64,${bytes.toString("base64")}`;
}

function parseSize(size) {
  const match = String(size || "1024x1024").match(/^(\d+)x(\d+)$/i);
  if (!match) return { width: 1024, height: 1024 };
  return {
    width: Math.max(64, Math.min(4096, Number(match[1]))),
    height: Math.max(64, Math.min(4096, Number(match[2]))),
  };
}

function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

function aspectRatioFromSize(size) {
  const { width, height } = parseSize(size);
  const divisor = gcd(width, height);
  const simple = `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
  const common = [
    "1:1",
    "16:9",
    "9:16",
    "4:3",
    "3:4",
    "3:2",
    "2:3",
    "21:9",
    "5:4",
    "4:5",
  ];
  if (common.includes(simple)) return simple;
  if (Math.abs(width / height - 1) < 0.08) return "1:1";
  return width > height ? "16:9" : "9:16";
}

function openAISize(size, model) {
  if (size === "auto") return "auto";
  const { width, height } = parseSize(size);
  const ratio = width / height;
  if (model === "dall-e-3") {
    if (Math.abs(ratio - 1) < 0.08) return "1024x1024";
    return ratio > 1 ? "1792x1024" : "1024x1792";
  }
  if (Math.abs(ratio - 1) < 0.08) return "1024x1024";
  return ratio > 1 ? "1536x1024" : "1024x1536";
}

async function callOpenAI(input) {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      model: input.model,
      prompt: input.prompt,
      size: openAISize(input.size, input.model),
      quality: input.quality || "auto",
      n: 1,
      output_format: "png",
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  return asDataUrl(response);
}

async function callStability(input) {
  const endpointMap = {
    "stable-image-ultra": "ultra",
    "stable-image-core": "core",
  };
  const endpoint = endpointMap[input.model] || "sd3";
  const form = new FormData();
  form.append("prompt", input.prompt);
  form.append("aspect_ratio", aspectRatioFromSize(input.size));
  form.append("output_format", "png");
  if (input.negativePrompt) form.append("negative_prompt", input.negativePrompt);
  if (endpoint === "sd3") form.append("model", input.model.replace("sd", "sd"));

  const response = await fetch(`https://api.stability.ai/v2beta/stable-image/generate/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      Accept: "image/*",
    },
    body: form,
  });
  if (!response.ok) throw new Error(await response.text());
  return asDataUrl(response);
}

async function callFal(input) {
  const response = await fetch(`https://fal.run/${input.model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${input.apiKey}`,
    },
    body: JSON.stringify({
      prompt: input.prompt,
      image_size: input.size === "auto" ? "square_hd" : input.size,
      num_images: 1,
      output_format: "png",
      enable_safety_checker: input.safeMode !== false,
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  return asDataUrl(response);
}

async function callReplicate(input) {
  const [owner, name] = input.model.split("/");
  const response = await fetch(`https://api.replicate.com/v1/models/${owner}/${name}/predictions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${input.apiKey}`,
      Prefer: "wait",
    },
    body: JSON.stringify({
      input: {
        prompt: input.prompt,
        aspect_ratio: aspectRatioFromSize(input.size),
        output_format: "png",
      },
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  return asDataUrl(response);
}

async function callGoogle(input) {
  const modelMap = {
    "nano-banana": "gemini-2.5-flash-image",
    "Nano Banana": "gemini-2.5-flash-image",
  };
  const model = modelMap[input.model] || input.model;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(input.apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: input.prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  return asDataUrl(response);
}

async function callIdeogram(input) {
  const response = await fetch("https://api.ideogram.ai/v1/ideogram-v3/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": input.apiKey,
    },
    body: JSON.stringify({
      prompt: input.prompt,
      aspect_ratio: aspectRatioFromSize(input.size),
      rendering_speed: input.quality === "high" ? "QUALITY" : "DEFAULT",
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  return asDataUrl(response);
}

async function callLeonardo(input) {
  const response = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.apiKey}`,
    },
    body: JSON.stringify({
      prompt: input.prompt,
      modelId: input.model,
      width: parseSize(input.size).width,
      height: parseSize(input.size).height,
      num_images: 1,
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  return asDataUrl(response);
}

async function generateImage(input) {
  if (!input.prompt || input.prompt.length < 3) throw new Error("缺少提示词");
  if (!input.apiKey) throw new Error("缺少 API Key");
  const adapters = {
    openai: callOpenAI,
    stability: callStability,
    fal: callFal,
    replicate: callReplicate,
    google: callGoogle,
    ideogram: callIdeogram,
    leonardo: callLeonardo,
  };
  const adapter = adapters[input.provider];
  if (!adapter) throw new Error("不支持的图片服务商");
  return adapter(input);
}

function widgetMapForNode(node) {
  const values = node.widgets_values || [];
  const maps = {
    CLIPTextEncode: ["text"],
    KSampler: ["seed", "control_after_generate", "steps", "cfg", "sampler_name", "scheduler", "denoise"],
    VAELoader: ["vae_name"],
    CLIPLoader: ["clip_name", "type", "device"],
    ModelSamplingSD3: ["shift"],
    UNETLoader: ["unet_name", "weight_dtype"],
    SaveWEBM: ["filename_prefix", "codec", "fps", "crf"],
    SaveAnimatedWEBP: ["filename_prefix", "fps", "lossless", "quality", "method"],
    Wan22ImageToVideoLatent: ["width", "height", "length", "batch_size"],
  };
  const names = maps[node.type] || [];
  return Object.fromEntries(names.map((name, index) => [name, values[index]]).filter(([, value]) => value !== undefined));
}

function workflowToComfyPrompt(workflow) {
  const prompt = {};
  const linkMap = new Map();
  for (const link of workflow.links || []) {
    const [id, originId, originSlot] = link;
    linkMap.set(id, [String(originId), originSlot]);
  }
  for (const node of workflow.nodes || []) {
    if (node.type === "Note") continue;
    const inputs = widgetMapForNode(node);
    for (const input of node.inputs || []) {
      if (input.link != null && linkMap.has(input.link)) {
        inputs[input.name] = linkMap.get(input.link);
      }
    }
    prompt[String(node.id)] = {
      class_type: node.type,
      inputs,
    };
  }
  return prompt;
}

function patchWanWorkflow(workflow, input) {
  const width = input.ratio?.includes("16:9") ? 1280 : input.ratio?.includes("1:1") ? 1024 : 704;
  const height = input.ratio?.includes("16:9") ? 704 : input.ratio?.includes("1:1") ? 1024 : 1280;
  const length = input.duration?.includes("12") ? 81 : input.duration?.includes("8") ? 61 : 41;
  const seed = Math.floor(Date.now() % 1_000_000_000);
  for (const node of workflow.nodes || []) {
    if (node.type === "CLIPTextEncode" && node.title?.includes("Positive")) {
      node.widgets_values = [input.prompt || ""];
    }
    if (node.type === "CLIPTextEncode" && node.title?.includes("Negative")) {
      node.widgets_values = [input.negativePrompt || ""];
    }
    if (node.type === "KSampler") {
      node.widgets_values = [seed, "randomize", 30, 5, "uni_pc", "simple", 1];
    }
    if (node.type === "UNETLoader") {
      node.widgets_values = ["wan2.2_ti2v_5B_fp16.safetensors", "default"];
    }
    if (node.type === "VAELoader") {
      node.widgets_values = ["wan2.2_vae.safetensors"];
    }
    if (node.type === "CLIPLoader") {
      node.widgets_values = ["umt5_xxl_fp16.safetensors", "wan", "default"];
    }
    if (node.type === "Wan22ImageToVideoLatent") {
      node.widgets_values = [width, height, length, 1];
    }
  }
  return workflow;
}

async function buildComfyPrompt(input) {
  const workflowPath = input.mode === "image" && input.imageWorkflow ? input.imageWorkflow : input.textWorkflow;
  if (!workflowPath) throw new Error("缺少 Wan 2.2 工作流 JSON 路径");
  await fs.access(input.modelDirectory || path.dirname(workflowPath));
  await fs.access(input.modelPath);
  await fs.access(workflowPath);
  const workflow = JSON.parse(await fs.readFile(workflowPath, "utf8"));
  return workflowToComfyPrompt(patchWanWorkflow(workflow, input));
}

async function callLocalVideo(input) {
  if (!input.endpoint) throw new Error("缺少本地影片服务地址");
  const headers = { "Content-Type": "application/json" };
  if (input.token) headers.Authorization = `Bearer ${input.token}`;
  let payload = {
    model: input.model,
    modelDirectory: input.modelDirectory,
    modelPath: input.modelPath,
    prompt: input.prompt,
    negativePrompt: input.negativePrompt,
    duration: input.duration,
    ratio: input.ratio,
    quality: input.quality,
    seed: input.seed,
    motion: input.motion,
    safeMode: input.safeMode,
    adapter: input.method,
  };
  if (input.method === "ComfyUI Prompt") {
    payload = {
      client_id: crypto.randomUUID(),
      prompt: await buildComfyPrompt(input),
    };
  }

  const response = await fetch(input.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const contentType = response.headers.get("content-type") || "";
  if (!response.ok) throw new Error(await response.text());
  if (contentType.startsWith("video/")) {
    const bytes = Buffer.from(await response.arrayBuffer());
    return { videoUrl: `data:${contentType.split(";")[0]};base64,${bytes.toString("base64")}` };
  }
  const data = contentType.includes("json") ? await response.json() : { message: await response.text() };
  return {
    pending: Boolean(data.pending || data.jobId || data.prompt_id || data.id),
    videoUrl: data.videoUrl || data.url || data.output?.[0] || data.result?.videoUrl || "",
    message: data.message || data.status || data.prompt_id || data.jobId || data.id || "本地服务已接收任务",
    raw: data,
  };
}

async function testLocalVideo(input) {
  if (!input.endpoint) throw new Error("缺少本地影片服务地址");
  if (input.modelDirectory) {
    await fs.access(input.modelDirectory);
  }
  if (input.modelPath) {
    await fs.access(input.modelPath);
  }
  if (input.textWorkflow) {
    await fs.access(input.textWorkflow);
  }
  if (input.imageWorkflow) {
    await fs.access(input.imageWorkflow);
  }
  const headers = { "Content-Type": "application/json" };
  if (input.token) headers.Authorization = `Bearer ${input.token}`;
  const response = await fetch(input.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ ping: true, adapter: input.method || "POST JSON" }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return true;
}

function bytePlusRatio(ratio) {
  if (String(ratio).includes("x")) return aspectRatioFromSize(ratio);
  if (String(ratio).includes("16:9")) return "16:9";
  if (String(ratio).includes("1:1")) return "1:1";
  if (String(ratio).includes("21:9")) return "21:9";
  return "9:16";
}

function bytePlusResolution(quality) {
  if (String(quality).includes("4K")) return "1080p";
  if (String(quality).includes("快速")) return "480p";
  return "720p";
}

function bytePlusTimeBudget(duration) {
  const numeric = Number(String(duration || "").match(/\d+/)?.[0] || 0);
  if (numeric >= 15) return 3;
  if (String(duration).includes("12")) return 3;
  if (String(duration).includes("8")) return 2;
  return 1;
}

function isBytePlusArkEndpoint(endpoint) {
  return String(endpoint || "").includes("ark.ap-southeast.bytepluses.com")
    || String(endpoint || "").includes("ark.cn-beijing.volces.com")
    || String(endpoint || "").includes("/contents/generations/tasks");
}

function normalizeSeedanceModelId(model, endpoint = "") {
  const id = String(model || "");
  const isVolcengine = String(endpoint || "").includes("ark.cn-beijing.volces.com");
  const isBytePlusGlobal = String(endpoint || "").includes("ark.ap-southeast.bytepluses.com");
  if (isBytePlusGlobal) {
    if (id === "doubao-seedance-1-5-pro-251215") return "seedance-1-5-pro-251215";
    if (id === "doubao-seedance-1-0-pro-fast-251015") return "seedance-1-0-pro-fast-251015";
    if (id === "doubao-seedance-1-0-pro-250528") return "seedance-1-0-pro-250528";
    if (id === "doubao-seedance-1-0-lite-t2v-250428") return "seedance-1-0-lite-t2v-250428";
    if (id === "doubao-seedance-1-0-lite-i2v-250428") return "seedance-1-0-lite-i2v-250428";
    return id;
  }
  if (!isVolcengine) return id;
  if (id === "seedance-1-5-pro-251215") return "doubao-seedance-1-5-pro-251215";
  if (id === "seedance-1-0-pro-fast-251015") return "doubao-seedance-1-0-pro-fast-251015";
  if (id === "seedance-1-0-pro-250528") return "doubao-seedance-1-0-pro-250528";
  if (id === "seedance-1-0-lite-t2v-250428") return "doubao-seedance-1-0-lite-t2v-250428";
  if (id === "seedance-1-0-lite-i2v-250428") return "doubao-seedance-1-0-lite-t2v-250428";
  return id;
}

function bytePlusDurationSeconds(duration, input = {}) {
  const durationText = String(duration || "").toLowerCase();
  if (durationText.includes("auto") || durationText.includes("自动") || durationText.includes("reference")) {
    const promptLength = String(input.prompt || "").trim().length;
    const imageCount = seedanceImageUrls(input).length;
    if (promptLength > 420 || imageCount >= 4) return 12;
    if (promptLength > 160 || imageCount >= 2) return 8;
    return 5;
  }
  const numeric = Number(String(duration || "").match(/\d+/)?.[0] || 0);
  if (numeric > 0) return Math.max(4, Math.min(12, numeric));
  return 8;
}

function bytePlusArkResolution(quality) {
  const text = String(quality || "").toLowerCase();
  if (text.includes("480") || text.includes("快速") || text.includes("draft")) return "480p";
  if (text.includes("1080") || text.includes("4k")) return "1080p";
  return "720p";
}

function appendSeedanceTextControls(prompt, input) {
  const text = String(prompt || "").trim();
  const ratio = bytePlusRatio(input.size || input.ratio);
  const duration = bytePlusDurationSeconds(input.duration, input);
  const resolution = bytePlusArkResolution(input.quality);
  const isAutoDuration = String(input.duration || "").toLowerCase().includes("auto")
    || String(input.duration || "").includes("自动")
    || String(input.duration || "").includes("reference");
  const strictBrief = [
    "请严格按照用户提供的提示词和已上传的参考图/分镜图生成影片。",
    "参考图是影片内容、人物、产品、构图、顺序和视觉风格的主要依据，不要忽略、替换或新增无关内容。",
    "必须生成完整连贯的影片内容，镜头动作、主体、场景和情绪都要贴合用户提示词。",
    isAutoDuration ? `请根据提示词复杂度和参考图数量生成最合适的 ${duration} 秒成片。` : "",
  ].filter(Boolean).join("\n");
  const controls = [];
  if (!/(^|\s)--(ratio|rt)\b/i.test(text)) controls.push(`--ratio ${ratio}`);
  if (!/(^|\s)--(dur|duration)\b/i.test(text)) controls.push(`--duration ${duration}`);
  if (!/(^|\s)--(rs|resolution)\b/i.test(text)) controls.push(`--rs ${resolution}`);
  return [strictBrief, text, ...controls].filter(Boolean).join("\n\n");
}

function seedanceImageUrl(input) {
  return String(input.imageUrl || input.image_url || input.referenceImageUrl || "").trim();
}

function seedanceImageUrls(input) {
  const urls = Array.isArray(input.imageUrls) ? input.imageUrls : [];
  return [
    ...urls,
    seedanceImageUrl(input),
  ].map((url) => String(url || "").trim()).filter(Boolean);
}

function findSeedanceValue(value, keys) {
  if (!value || typeof value !== "object") return "";
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findSeedanceValue(item, keys);
      if (found) return found;
    }
    return "";
  }
  for (const key of keys) {
    const direct = value[key];
    if (typeof direct === "string" && direct.trim()) return direct.trim();
  }
  for (const item of Object.values(value)) {
    const found = findSeedanceValue(item, keys);
    if (found) return found;
  }
  return "";
}

function findSeedanceVideoLike(value) {
  if (!value) return "";
  if (typeof value === "string") {
    return /\.(mp4|mov|webm)(\?|#|$)/i.test(value) ? value.trim() : "";
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findSeedanceVideoLike(item);
      if (found) return found;
    }
    return "";
  }
  if (typeof value === "object") {
    for (const item of Object.values(value)) {
      const found = findSeedanceVideoLike(item);
      if (found) return found;
    }
  }
  return "";
}

function seedanceTaskStatus(data) {
  const status = findSeedanceValue(data, ["status", "Status", "state", "State", "phase", "Phase"]);
  return status ? status.toLowerCase() : "";
}

function seedanceTaskVideoUrl(data) {
  return findSeedanceValue(data, [
    "video_url",
    "videoUrl",
    "videoURL",
    "download_url",
    "downloadUrl",
    "result_url",
    "resultUrl",
  ]) || findSeedanceVideoLike(data);
}

function normalizeArkApiKey(apiKey) {
  let key = String(apiKey || "").trim();
  key = key.replace(/^export\s+/i, "").trim();
  const envMatch = key.match(/^ARK_API_KEY\s*=\s*(.+)$/i);
  if (envMatch) key = envMatch[1].trim();
  key = key.replace(/^Bearer\s+/i, "").trim();
  key = key.replace(/^['"]|['"]$/g, "").trim();
  return key;
}

async function callBytePlusVideo(input) {
  if (!input.apiKey) throw new Error("缺少 BytePlus API Key");
  if (!input.endpoint) throw new Error("缺少 BytePlus Endpoint");
  const apiKey = normalizeArkApiKey(input.apiKey);
  if (isBytePlusArkEndpoint(input.endpoint)) {
    const model = normalizeSeedanceModelId(input.model, input.endpoint);
    const body = {
      model,
      content: [
        {
          type: "text",
          text: appendSeedanceTextControls(input.prompt, input),
        },
      ],
    };
    const imageUrls = seedanceImageUrls(input);
    imageUrls.forEach((imageUrl) => {
      body.content.push({
        type: "image_url",
        image_url: {
          url: imageUrl,
        },
      });
    });
    if (input.webhook) body.callback_url = input.webhook;
    if (input.negativePrompt) body.negative_prompt = input.negativePrompt;
    const response = await fetch(input.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(async () => ({ message: await response.text() }));
    if (!response.ok || data?.error || data?.Error) {
      const message = data?.error?.message || data?.Error?.Message || data?.message || `HTTP ${response.status}`;
      if (/api key format|apikey|api key|unauthorized|permission|forbidden|401|403/i.test(message)) {
        throw new Error(`${message}。Seedance REST API 已按 Authorization: Bearer $ARK_API_KEY 发送，请确认 Key 是 BytePlus Ark 控制台为该模型创建的有效 API Key。`);
      }
      throw new Error(message);
    }
    const taskId = data?.id || data?.task_id || data?.TaskId || data?.Result?.TaskId;
    return {
      taskId,
      pending: true,
      message: taskId ? `火山引擎方舟 Seedance TaskId: ${taskId}` : "火山引擎方舟 Seedance 任务已提交",
      raw: data,
    };
  }
  throw new Error("Seedance 现在严格使用 REST API：Endpoint 必须是 https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks");
}

async function queryBytePlusTask(input) {
  if (!input.apiKey) throw new Error("缺少 BytePlus API Key");
  if (!input.endpoint) throw new Error("缺少 BytePlus Endpoint");
  if (!input.taskId) throw new Error("缺少 Seedance Task ID");
  const apiKey = normalizeArkApiKey(input.apiKey);
  const endpoint = String(input.endpoint || "").replace(/\/+$/, "");
  const response = await fetch(`${endpoint}/${encodeURIComponent(input.taskId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json().catch(async () => ({ message: await response.text() }));
  if (!response.ok || data?.error || data?.Error) {
    throw new Error(data?.error?.message || data?.Error?.Message || data?.message || `HTTP ${response.status}`);
  }
  const status = seedanceTaskStatus(data);
  const videoUrl = seedanceTaskVideoUrl(data);
  const failed = /fail|error|cancel|expire|reject/.test(status);
  return {
    taskId: input.taskId,
    status,
    videoUrl,
    pending: !videoUrl && !failed,
    raw: data,
  };
}

function googleVeoModelId(model) {
  const modelMap = {
    "Veo 3.1 Quality": "veo-3.1-generate-preview",
    "Veo 3.1": "veo-3.1-generate-preview",
    "Veo 3": "veo-3.0-generate-001",
    "Veo 3 Fast": "veo-3.0-fast-generate-001",
    "Gemini Veo 3.1": "veo-3.1-generate-preview",
    "Google Veo 3.1": "veo-3.1-generate-preview",
    "Gemini Veo 3.1 Fast": "veo-3.1-fast-generate-preview",
    "Google Veo 3.1 Fast": "veo-3.1-fast-generate-preview",
    "Gemini Veo 3.1 Lite": "veo-3.1-lite-generate-preview",
    "Google Veo 3.1 Lite": "veo-3.1-lite-generate-preview",
    "Gemini Veo 3": "veo-3.0-generate-001",
    "Google Veo 3": "veo-3.0-generate-001",
    "Gemini Veo 3 Fast": "veo-3.0-fast-generate-001",
    "Google Veo 3 Fast": "veo-3.0-fast-generate-001",
    "Gemini Veo 2": "veo-2.0-generate-001",
    "Google Veo 2": "veo-2.0-generate-001",
  };
  return modelMap[model] || model || "veo-3.1-generate-preview";
}

function googleVeoEndpoint(endpoint, model) {
  const base = endpoint?.match(/^(https:\/\/generativelanguage\.googleapis\.com\/v1beta)/)?.[1]
    || "https://generativelanguage.googleapis.com/v1beta";
  return `${base}/models/${googleVeoModelId(model)}:predictLongRunning`;
}

function googleVeoResolution(quality) {
  const text = String(quality || "").toLowerCase();
  if (text.includes("4k")) return "4k";
  if (text.includes("1080") || text.includes("hd")) return "1080p";
  return "720p";
}

function googleVeoAspectRatio(input) {
  const ratio = aspectRatioFromSize(input.size || input.ratio);
  return ratio === "9:16" ? "9:16" : "16:9";
}

function googleVeoDurationSeconds(input, resolution) {
  if (resolution === "1080p" || resolution === "4k") return 8;
  const match = String(input.duration || "").match(/\d+/);
  const value = match ? Number(match[0]) : 8;
  if (value <= 4) return 4;
  if (value <= 6) return 6;
  return 8;
}

function isGoogleVeoRequest(input) {
  return input.provider === "google"
    || String(input.endpoint || "").includes("generativelanguage.googleapis.com")
    || String(input.model || "").toLowerCase().includes("veo");
}

function googleVeoOperationUrl(operationName) {
  if (/^https?:\/\//.test(operationName)) return operationName;
  return `https://generativelanguage.googleapis.com/v1beta/${operationName.replace(/^\/+/, "")}`;
}

async function pollGoogleVeoOperation(operationName, apiKey) {
  let status = null;
  for (let attempt = 0; attempt < 36; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 3000 : 10000));
    const response = await fetch(googleVeoOperationUrl(operationName), {
      headers: { "x-goog-api-key": apiKey },
    });
    status = await response.json().catch(async () => ({ message: await response.text() }));
    if (!response.ok || status?.error) {
      throw new Error(status?.error?.message || status?.message || `Google Veo 状态检查失败：HTTP ${response.status}`);
    }
    if (status.done) return status;
  }
  return status || { done: false, name: operationName };
}

async function getGoogleVeoOperation(operationName, apiKey) {
  const response = await fetch(googleVeoOperationUrl(operationName), {
    headers: { "x-goog-api-key": apiKey },
  });
  const status = await response.json().catch(async () => ({ message: await response.text() }));
  if (!response.ok || status?.error) {
    throw new Error(status?.error?.message || status?.message || `Google Veo 状态检查失败：HTTP ${response.status}`);
  }
  return status;
}

function googleVeoVideoUri(operation) {
  return operation?.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
    || operation?.response?.generatedVideos?.[0]?.video?.uri
    || operation?.response?.generated_videos?.[0]?.video?.uri
    || operation?.response?.generated_videos?.[0]?.video?.url
    || "";
}

async function callCloudVideo(input) {
  if (!input.apiKey) throw new Error(`缺少 ${input.providerLabel || input.provider} API Key`);
  if (!input.endpoint) throw new Error(`缺少 ${input.providerLabel || input.provider} Endpoint`);
  if (isGoogleVeoRequest(input)) {
    const aspectRatio = googleVeoAspectRatio(input);
    let resolution = googleVeoResolution(input.quality);
    const modelId = googleVeoModelId(input.model);
    if (modelId.includes("veo-3.0") && aspectRatio === "9:16" && resolution !== "720p") {
      resolution = "720p";
    }
    const body = {
      instances: [
        {
          prompt: input.prompt,
        },
      ],
      parameters: {
        aspectRatio,
        durationSeconds: googleVeoDurationSeconds(input, resolution),
        resolution,
      },
    };
    const response = await fetch(googleVeoEndpoint(input.endpoint, input.model), {
      method: "POST",
      headers: {
        "x-goog-api-key": input.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(async () => ({ message: await response.text() }));
    if (!response.ok || data?.error) {
      throw new Error(data?.error?.message || data?.message || `HTTP ${response.status}`);
    }
    const taskId = data?.name || data?.id || data?.operation?.name || "";
    return {
      taskId,
      pending: true,
      message: taskId ? `Google Gemini / Veo 正在生成：${taskId}` : "Google Gemini / Veo 任务已提交",
      raw: data,
    };
  }
  const body = {
    model: input.model,
    prompt: input.prompt,
    negative_prompt: input.negativePrompt,
    duration: input.duration,
    aspect_ratio: input.size ? aspectRatioFromSize(input.size) : input.ratio,
    size: input.size,
    quality: input.quality,
    mode: input.mode,
  };
  const headers = {
    Authorization: `Bearer ${input.apiKey}`,
    "Content-Type": "application/json",
  };
  if (input.provider === "fal") headers.Authorization = `Key ${input.apiKey}`;
  if (input.provider === "replicate") headers.Authorization = `Token ${input.apiKey}`;
  const endpoint = input.endpoint;
  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(async () => ({ message: await response.text() }));
  if (!response.ok || data?.error || data?.Error) {
    throw new Error(data?.error?.message || data?.Error?.Message || data?.message || `HTTP ${response.status}`);
  }
  const taskId = data?.id || data?.task_id || data?.taskId || data?.generation_id || data?.Result?.TaskId;
  return {
    taskId,
    message: taskId ? `${input.providerLabel || input.provider} TaskId: ${taskId}` : `${input.providerLabel || input.provider} 任务已提交`,
    raw: data,
  };
}

async function checkGoogleVeoVideo(input) {
  if (!input.apiKey) throw new Error("缺少 Google Gemini / Veo API Key");
  if (!input.operationName) throw new Error("缺少 Google Gemini / Veo Operation ID");
  const operation = await getGoogleVeoOperation(input.operationName, input.apiKey);
  if (!operation.done) {
    return {
      pending: true,
      taskId: input.operationName,
      message: "Google Gemini / Veo 仍在生成中",
      raw: operation,
    };
  }
  const videoUri = googleVeoVideoUri(operation);
  if (!videoUri) {
    throw new Error("Google Gemini / Veo 已完成，但没有返回可下载的视频链接");
  }
  const videoResponse = await fetch(videoUri, {
    headers: { "x-goog-api-key": input.apiKey },
  });
  if (!videoResponse.ok) throw new Error(`Google Gemini / Veo 视频下载失败：HTTP ${videoResponse.status}`);
  return {
    pending: false,
    taskId: input.operationName,
    videoUrl: await asVideoDataUrl(videoResponse),
    message: "Google Gemini / Veo 影片已生成",
    raw: operation,
  };
}

async function testBytePlus(input) {
  if (!input.apiKey) throw new Error("缺少 BytePlus API Key");
  if (!input.endpoint) throw new Error("缺少 BytePlus Endpoint");
  const apiKey = normalizeArkApiKey(input.apiKey);
  if (isBytePlusArkEndpoint(input.endpoint)) {
    const response = await fetch(input.endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: normalizeSeedanceModelId("seedance-1-5-pro-251215", input.endpoint),
        content: [
          {
            type: "text",
            text: "At breakneck speed, drones thread through intricate obstacles or stunning natural wonders, delivering an immersive, heart-pounding flying experience. --duration 5 --camerafixed false",
          },
          {
            type: "image_url",
            image_url: {
              url: "https://ark-doc.tos-ap-southeast-1.bytepluses.com/seepro_i2v%20.png",
            },
          },
        ],
      }),
    });
    const data = await response.json().catch(async () => ({ message: await response.text() }));
    const message = data?.error?.message || data?.Error?.Message || data?.message || "";
    if (/api key format|apikey|api key|unauthorized|permission|forbidden|401|403/i.test(message)) {
      throw new Error(`${message}。Seedance REST API 已按 Authorization: Bearer $ARK_API_KEY 发送，请确认 Key 是 BytePlus Ark 控制台为该模型创建的有效 API Key。`);
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error(`${message}。Seedance REST API 已按 Authorization: Bearer $ARK_API_KEY 发送，请确认 Key 有 Seedance 模型权限。`);
    }
    if (response.status === 404) throw new Error("火山引擎方舟 endpoint 不正确，请使用 /api/v3/contents/generations/tasks");
    if (!response.ok || data?.error || data?.Error) {
      throw new Error(message || `HTTP ${response.status}`);
    }
    const taskId = data?.id || data?.task_id || data?.TaskId || data?.Result?.TaskId;
    return {
      taskId,
      message: taskId ? `Seedance 测试草稿已提交，TaskId: ${taskId}` : "Seedance 测试草稿已提交",
      raw: data,
    };
  }
  throw new Error("Seedance 测试现在严格使用 REST API：Endpoint 必须是 https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks");
}

async function testCloudVideo(input) {
  if (!input.apiKey) throw new Error(`缺少 ${input.providerLabel || input.provider} API Key`);
  if (!input.endpoint) throw new Error(`缺少 ${input.providerLabel || input.provider} Endpoint`);
  return true;
}

async function testProvider(input) {
  if (!input.provider || !input.apiKey) throw new Error("缺少服务商或 API Key");
  const url = providerHosts[input.provider];
  if (!url) return true;
  const headers = {};
  if (input.provider === "openai") headers.Authorization = `Bearer ${input.apiKey}`;
  if (input.provider === "stability") headers.Authorization = `Bearer ${input.apiKey}`;
  if (input.provider === "replicate") headers.Authorization = `Token ${input.apiKey}`;
  if (input.provider === "fal") headers.Authorization = `Key ${input.apiKey}`;
  if (input.provider === "ideogram") headers["Api-Key"] = input.apiKey;
  if (input.provider === "leonardo") headers.Authorization = `Bearer ${input.apiKey}`;
  const target = input.provider === "google" ? `${url}?key=${encodeURIComponent(input.apiKey)}` : url;
  const response = await fetch(target, { headers });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return true;
}

async function optimizePrompt(input) {
  if (!input.openaiKey) {
    throw new Error("缺少 OpenAI API Key，无法联网使用 ChatGPT 优化");
  }
  const system = "You optimize prompts for AI image and video generation. Return only the improved prompt in Chinese. Make it complete, concrete, model-friendly, and concise.";
  const user = `模式: ${input.mode}
模型: ${input.model}
目标: ${input.target === "negative" ? "负面提示词" : "主提示词"}
原始提示词: ${input.prompt || ""}`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.6,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "ChatGPT 优化失败");
  return {
    prompt: data.choices?.[0]?.message?.content?.trim() || "",
    fallback: false,
  };
}

async function generateCopyChat(input) {
  if (!input.apiKey) throw new Error(`缺少 ${input.providerLabel || input.provider || "LLM"} API Key`);
  const system = `You are DreamForge's general AI conversation assistant.
Answer the user's request directly, using the selected model's real API response.
Do not force a preset writing format or marketing template.
Use uploaded references and conversation history only when they are relevant.
If current or factual accuracy matters and web access is available, use it before answering.
Reply in the user's language unless they ask otherwise.`;
  const attachments = Array.isArray(input.attachments)
    ? input.attachments.slice(0, 6).filter((item) => item?.name)
    : [];
  const attachmentContext = attachments.length
    ? `\n\n用户上传的参考资料:\n${attachments.map((item, index) => {
        const text = item.text ? `\n可读取文本摘录:\n${String(item.text).slice(0, 12000)}` : "";
        return `${index + 1}. ${item.name} (${item.kind || "file"}, ${item.type || "unknown"})${text}`;
      }).join("\n\n")}\n请把这些参考资料作为上下文。如果是图片，请根据用户问题分析图片中相关的主体、风格、构图、颜色、场景或文字信息。`
    : "";
  const user = `用户消息:
${input.prompt || ""}
${attachmentContext}

请直接根据用户消息、历史对话和参考资料回答。不要套用预设模板。`;
  const history = Array.isArray(input.history)
    ? input.history.slice(-10).filter((message) => message?.text)
    : [];
  const historyText = history.map((message) => `${message.role === "user" ? "用户" : "助手"}：${message.text}`).join("\n\n");
  const fullUser = history.length
    ? `以下是此前对话，请延续上下文修改文案，不要从零开始，除非用户明确要求。\n${historyText}\n\n新的用户要求：\n${user}`
    : user;
  const provider = input.provider || "openai";
  const requestedModel = input.model || "";
  const modelAliases = {
    "gemini-3.5-flash": "gemini-3-flash-preview",
  };
  const resolvedModel = modelAliases[requestedModel] || requestedModel;
  const imageAttachments = attachments.filter((item) => item.kind === "image" && item.dataUrl);
  const supportsVisionContent = ["openai", "openrouter", "xai"].includes(provider);
  const openAiUserContent = imageAttachments.length && supportsVisionContent
    ? [
        { type: "text", text: user },
        ...imageAttachments.map((item) => ({ type: "image_url", image_url: { url: item.dataUrl } })),
      ]
    : user;
  const chatMessages = [
    { role: "system", content: system },
    ...history.map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.text || ""),
    })),
    { role: "user", content: openAiUserContent },
  ];
  if (provider === "openai") {
    const openAiInputContent = [
      { type: "input_text", text: fullUser },
      ...imageAttachments.map((item) => ({ type: "input_image", image_url: item.dataUrl, detail: "auto" })),
    ];
    const responsesPayload = {
      model: resolvedModel || "gpt-5.5",
      instructions: system,
      input: [{ role: "user", content: openAiInputContent }],
      max_output_tokens: 1600,
      store: false,
      tools: [{ type: "web_search_preview" }],
    };
    let response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responsesPayload),
    });
    let data = await response.json().catch(async () => ({ message: await response.text() }));
    if (!response.ok || data?.error) {
      const message = data?.error?.message || data?.message || "";
      if (/web_search|tool|tools|unsupported|not supported/i.test(message)) {
        const { tools, ...payloadWithoutTools } = responsesPayload;
        response = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${input.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadWithoutTools),
        });
        data = await response.json().catch(async () => ({ message: await response.text() }));
      }
    }
    if (!response.ok || data?.error) {
      const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${input.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: resolvedModel || "gpt-5.5",
          messages: chatMessages,
        }),
      });
      const chatData = await chatResponse.json().catch(async () => ({ message: await chatResponse.text() }));
      if (!chatResponse.ok || chatData?.error) {
        const errorMessage = chatData?.error?.message || data?.error?.message || chatData?.message || data?.message || "OpenAI 对话生成失败";
        throw new Error(errorMessage);
      }
      return { text: chatData.choices?.[0]?.message?.content?.trim() || "OpenAI 没有返回回复" };
    }
    const text = data.output_text
      || data.output?.flatMap((item) => item.content || [])
        .map((part) => part.text || part.content || "")
        .filter(Boolean)
        .join("\n")
        .trim();
    return { text: text || "OpenAI 没有返回回复" };
  }
  if (provider === "google") {
    const geminiImageParts = imageAttachments.map((item) => {
      const [meta = "", data = ""] = String(item.dataUrl).split(",");
      const mimeType = meta.match(/data:(.*?);base64/)?.[1] || item.type || "image/png";
      return { inlineData: { mimeType, data } };
    }).filter((part) => part.inlineData.data);
    const geminiContents = [
      ...(history.length ? history.map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: String(message.text || "") }],
      })) : []),
      { role: "user", parts: [{ text: `${system}\n\n${user}` }, ...geminiImageParts] },
    ];
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${resolvedModel || "gemini-2.5-flash"}:generateContent?key=${encodeURIComponent(input.apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: geminiContents,
        generationConfig: { temperature: 0.7 },
      }),
    });
    const data = await response.json().catch(async () => ({ message: await response.text() }));
    if (!response.ok || data?.error) throw new Error(data?.error?.message || data?.message || "Gemini 对话生成失败");
    const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n").trim();
    return { text: text || "Gemini 没有返回回复" };
  }
  if (provider === "anthropic") {
    const anthropicUserContent = imageAttachments.length
      ? [
          { type: "text", text: user },
          ...imageAttachments.map((item) => {
            const [meta = "", data = ""] = String(item.dataUrl).split(",");
            const mediaType = meta.match(/data:(.*?);base64/)?.[1] || item.type || "image/png";
            return { type: "image", source: { type: "base64", media_type: mediaType, data } };
          }).filter((part) => part.source.data),
        ]
      : user;
    const anthropicMessages = [
      ...history.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: String(message.text || ""),
      })),
      { role: "user", content: anthropicUserContent },
    ];
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": input.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: resolvedModel || "claude-sonnet-4-5",
        max_tokens: 1400,
        temperature: 0.7,
        system,
        messages: anthropicMessages,
      }),
    });
    const data = await response.json().catch(async () => ({ message: await response.text() }));
    if (!response.ok || data?.error) throw new Error(data?.error?.message || data?.message || "Claude 对话生成失败");
    const text = data?.content?.map((part) => part.text).filter(Boolean).join("\n").trim();
    return { text: text || "Claude 没有返回回复" };
  }
  const endpoints = {
    openai: "https://api.openai.com/v1/chat/completions",
    deepseek: "https://api.deepseek.com/chat/completions",
    qwen: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    xai: "https://api.x.ai/v1/chat/completions",
    openrouter: "https://openrouter.ai/api/v1/chat/completions",
    mistral: "https://api.mistral.ai/v1/chat/completions",
    cohere: "https://api.cohere.com/compatibility/v1/chat/completions",
    perplexity: "https://api.perplexity.ai/chat/completions",
    moonshot: "https://api.moonshot.ai/v1/chat/completions",
    zhipu: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    groq: "https://api.groq.com/openai/v1/chat/completions",
    together: "https://api.together.xyz/v1/chat/completions",
    fireworks: "https://api.fireworks.ai/inference/v1/chat/completions",
    nvidia: "https://integrate.api.nvidia.com/v1/chat/completions",
    cerebras: "https://api.cerebras.ai/v1/chat/completions",
    sambanova: "https://api.sambanova.ai/v1/chat/completions",
    ai21: "https://api.ai21.com/studio/v1/chat/completions",
    baidu: "https://qianfan.baidubce.com/v2/chat/completions",
    minimax: "https://api.minimax.io/v1/text/chatcompletion_v2",
    yi: "https://api.lingyiwanwu.com/v1/chat/completions",
  };
  const fallbackModels = {
    openai: "gpt-5.5",
    deepseek: "deepseek-chat",
    qwen: "qwen-plus",
    xai: "grok-4",
    openrouter: "openai/gpt-5.5",
    mistral: "mistral-large-latest",
    cohere: "command-a-03-2025",
    perplexity: "sonar-pro",
    moonshot: "moonshot-v1-128k",
    zhipu: "glm-4-plus",
    groq: "llama-3.3-70b-versatile",
    together: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    fireworks: "accounts/fireworks/models/deepseek-v3",
    nvidia: "meta/llama-3.1-405b-instruct",
    cerebras: "llama3.1-70b",
    sambanova: "Meta-Llama-3.1-405B-Instruct",
    ai21: "jamba-large-1.7",
    baidu: "ernie-4.5-turbo-128k",
    minimax: "MiniMax-M1",
    yi: "yi-large",
  };
  const response = await fetch(endpoints[provider] || endpoints.openai, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
      ...(provider === "openrouter" ? {
        "HTTP-Referer": "http://127.0.0.1",
        "X-Title": "DreamForge",
      } : {}),
    },
    body: JSON.stringify({
      model: resolvedModel || fallbackModels[provider] || fallbackModels.openai,
      messages: chatMessages,
      temperature: 0.7,
    }),
  });
  const data = await response.json().catch(async () => ({ message: await response.text() }));
  if (!response.ok || data?.error) throw new Error(data?.error?.message || data?.message || "对话生成失败");
  return { text: data.choices?.[0]?.message?.content?.trim() || "模型没有返回回复" };
}

async function generateStoryboardScript(input) {
  if (!input.openaiKey) throw new Error("缺少 OpenAI Key，无法使用 ChatGPT 生成分镜脚本");
  const system = `You are a senior storyboard director.
Return only valid JSON. No markdown.
JSON schema:
{
  "optimizedCopy": "the original user copy with only typo cleanup if necessary",
  "shots": [
    {
      "title": "shot title",
      "duration": "3秒",
      "durationSeconds": 3,
      "action": "the exact action beat from the user's copy",
      "visual": "what the camera sees",
      "camera": "camera movement and lens",
      "dialogue": "voiceover or on-screen copy",
      "imagePrompt": "prompt for an AI image/storyboard panel",
      "videoPrompt": "prompt ready for the selected AI video model"
    }
  ]
}`;
const user = `用户文案/需求:
${input.copy || ""}

用户选择模型: ${input.model || "AI model"}
输出尺寸: ${input.size || "auto"}
单个影片模型片段最长: ${input.maxShotSeconds || 15} 秒
请严格按照用户原文拆分分镜，不要改写故事，不要增加原文没有的剧情。
把用户文案中每一个清晰动作、镜头动作、角色动作或对白节点拆成一个 shot。
如果文案有 9 个动作，就返回 9 个 shots。不要强行压缩成 4 到 8 个。
不要询问或依赖用户手动选择总时长。请根据故事节奏、对白长度、动作复杂度自动估算每个 shot 的自然 durationSeconds。
如果某个动作预计超过 ${input.maxShotSeconds || 15} 秒，请继续拆成多个连续 shots，而不是压缩内容。
如果用户文案是 2 分钟故事，就完整拆完 2 分钟故事，不要因为时长长而省略。
每个 shot 必须包含 action、visual、dialogue、camera、duration、durationSeconds、imagePrompt。
imagePrompt 用英文，适合生成清晰分镜图：cinematic storyboard frame, clear subject, director reference, no text, no subtitles, no watermark.`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.5",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "ChatGPT 分镜生成失败");
  const parsed = parseJsonObject(data.choices?.[0]?.message?.content || "{}", "分镜脚本");
  const shots = Array.isArray(parsed.shots) ? parsed.shots.slice(0, Number(input.maxShots || 120)) : [];
  if (!shots.length) throw new Error("ChatGPT 没有返回可用分镜");
  return {
    optimizedCopy: parsed.optimizedCopy || input.copy || "",
    shots,
  };
}

async function generateStoryboardPanels(input) {
  if (!input.openaiKey) throw new Error("缺少 OpenAI Key，无法生成分镜图");
  const script = await generateStoryboardScript(input);
  const shots = script.shots || [];
  const panels = [];
  for (let index = 0; index < shots.length; index += 1) {
    const shot = shots[index];
    const prompt = `${shot.imagePrompt || shot.visual || shot.action || input.copy}

Storyboard panel ${index + 1}.
Action: ${shot.action || shot.visual || ""}
Dialogue or voiceover context: ${shot.dialogue || "none"}
Style: cinematic storyboard frame, production reference for cinematographer, clear composition, realistic lighting, no text, no subtitle, no watermark.`;
    const imageUrl = await callOpenAI({
      apiKey: input.openaiKey,
      model: input.imageModel || "gpt-image-2",
      prompt,
      size: input.size || "1024x1024",
      quality: input.quality || "medium",
      safeMode: true,
    });
    panels.push({
      ...shot,
      imageUrl,
      panelNumber: index + 1,
    });
  }
  return {
    optimizedCopy: script.optimizedCopy,
    shots: panels,
  };
}

function parseJsonObject(text, label) {
  try {
    return JSON.parse(text || "{}");
  } catch {
    const fenced = String(text || "").match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) return JSON.parse(fenced[1]);
    const objectText = String(text || "").slice(String(text || "").indexOf("{"), String(text || "").lastIndexOf("}") + 1);
    if (objectText) return JSON.parse(objectText);
    throw new Error(`${label} 返回内容不是有效 JSON`);
  }
}

function decodeXml(text) {
  return String(text || "")
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

async function fetchMarketingNews() {
  const feeds = [
    "https://news.google.com/rss/topstories?hl=en-MY&gl=MY&ceid=MY:en",
    "https://news.google.com/rss/search?q=Malaysia+when:1d&hl=en-MY&gl=MY&ceid=MY:en",
    "https://news.google.com/rss/search?q=Malaysia+news+when:7d&hl=en-MY&gl=MY&ceid=MY:en",
    "https://news.google.com/rss/search?q=Malaysia+economy+business+when:7d&hl=en-MY&gl=MY&ceid=MY:en",
  ];
  const items = [];
  for (const feed of feeds) {
    try {
      const response = await fetch(feed);
      const xml = await response.text();
      const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const block of blocks.slice(0, 12)) {
        const title = decodeXml(block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
        const link = decodeXml(block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "");
        const published = decodeXml(block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "");
        const source = decodeXml(block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || "Google News");
        if (title && !items.some((item) => item.title === title)) items.push({ title, link, published, source });
      }
    } catch {
      // Keep trying other feeds; cached fallback is handled below.
    }
  }
  const payload = {
    updatedAt: Date.now(),
    region: "Malaysia",
    items: items
      .sort((a, b) => new Date(b.published || 0) - new Date(a.published || 0))
      .slice(0, 10),
  };
  const cached = await readJson(marketingNewsFile, null);
  if (!payload.items.length && cached?.items) return cached;
  await writeJson(marketingNewsFile, payload);
  return payload;
}

async function checkMarketingCopy(input) {
  if (!input.openaiKey) throw new Error("缺少 OpenAI Key，无法检查受众匹配");
  const system = `You are a marketing strategist. Return strict JSON only:
{"score": 0-100, "summary": "Chinese concise analysis", "suggestions": ["specific improvement"]}`;
  const user = `广告文案:
${input.copy || ""}

目标受众: ${input.audience || "未指定"}
营销目标: ${input.goal || "提升转化"}
投放渠道: ${input.channel || "社媒"}
今日马来西亚新闻参考: ${input.news || "无"}

请判断这个文案是否会被该受众看见、理解、产生兴趣并行动。`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "受众检查失败");
  return parseJsonObject(data.choices?.[0]?.message?.content || "{}", "受众检查");
}

async function runMarketingWorkflow(input) {
  if (!input.openaiKey) throw new Error("缺少 OpenAI Key");
  if (input.videoAdapter !== "local" && !input.apiKey) throw new Error(`缺少 ${input.providerLabel || "影片模型"} API Key`);
  if (!input.endpoint) throw new Error(`缺少 ${input.providerLabel || "影片模型"} Endpoint`);

  const system = "You are a senior marketing video strategist. Return strict JSON only.";
  const user = `Create a marketing video workflow from this copy and requirement.
Copy and requirement:
${input.copy}
Audience: ${input.audience || "not specified"}
Goal: ${input.goal || "conversion"}
Channel: ${input.channel || "social media"}
Today Malaysia news context: ${input.news || "none"}

Return JSON with:
optimizedCopy: polished Chinese ad copy and creative direction.
storyboard: array of 3 to 6 shots. Each shot has title, duration, prompt, transition.
editPlan: final assembly instructions in Chinese.
The storyboard prompts must be ready for ${input.modelLabel || input.model || "AI video"} generation.`;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "ChatGPT 生成 marketing workflow 失败");
  const workflow = parseJsonObject(data.choices?.[0]?.message?.content || "{}", "ChatGPT");
  const storyboard = Array.isArray(workflow.storyboard) ? workflow.storyboard.slice(0, 6) : [];
  if (!storyboard.length) throw new Error("ChatGPT 没有返回可用分镜");

  const tasks = [];
  for (let index = 0; index < storyboard.length; index += 1) {
    const shot = storyboard[index];
    try {
      const common = {
        endpoint: input.endpoint,
        model: input.model || input.modelLabel,
        prompt: shot.prompt || `${workflow.optimizedCopy}\n分镜 ${index + 1}: ${shot.title || ""}`,
        negativePrompt: "",
        duration: shot.duration || input.duration || "5 秒",
        ratio: input.ratio,
        size: input.size,
        quality: input.quality || "高清",
        mode: "marketing",
      };
      const result = input.videoAdapter === "byteplus"
        ? await callBytePlusVideo({
            ...common,
            apiKey: input.apiKey,
            workspaceId: input.workspaceId,
          })
        : input.videoAdapter === "local"
          ? await callLocalVideo({
              ...common,
              token: input.token,
              method: input.method,
              modelLabel: input.modelLabel,
              modelDirectory: input.modelDirectory,
              modelPath: input.modelPath,
              textWorkflow: input.textWorkflow,
            })
          : await callCloudVideo({
              ...common,
              provider: input.provider,
              providerLabel: input.providerLabel,
              apiKey: input.apiKey,
            });
      tasks.push({
        shot: index + 1,
        title: shot.title || `分镜 ${index + 1}`,
        status: "submitted",
        taskId: result.taskId || "",
        message: result.message,
      });
    } catch (error) {
      tasks.push({
        shot: index + 1,
        title: shot.title || `分镜 ${index + 1}`,
        status: "failed",
        taskId: "",
        message: String(error.message || error).slice(0, 300),
      });
    }
  }
  const submittedCount = tasks.filter((task) => task.status === "submitted").length;
  const failedCount = tasks.filter((task) => task.status === "failed").length;
  if (!submittedCount) {
    const reason = tasks.find((task) => task.message)?.message || "影片模型没有接收任何分镜任务";
    throw new Error(`Marketing workflow 影片提交失败：${reason}`);
  }

  return {
    optimizedCopy: workflow.optimizedCopy || input.copy,
    storyboard,
    editPlan: workflow.editPlan || "按分镜顺序剪辑，加入品牌结尾和行动号召。",
    tasks,
    submittedCount,
    failedCount,
  };
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let filePath = path.normalize(decodeURIComponent(url.pathname));
  if (filePath === "/") filePath = "/index.html";
  const absolute = path.join(root, filePath);
  if (!absolute.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const data = await fs.readFile(absolute);
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(absolute)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

async function proxyVideoDownload(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const source = url.searchParams.get("url");
  if (!source || !/^https?:\/\//i.test(source)) {
    sendJson(res, 400, { ok: false, error: "缺少可下载的影片 URL" });
    return;
  }
  const response = await fetch(source);
  if (!response.ok) {
    sendJson(res, response.status, { ok: false, error: `影片下载失败：HTTP ${response.status}` });
    return;
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  res.writeHead(200, {
    "Content-Type": response.headers.get("content-type") || "video/mp4",
    "Content-Disposition": 'attachment; filename="dreamforge-seedance-video.mp4"',
    "Content-Length": bytes.length,
  });
  res.end(bytes);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
    });
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && req.url === "/api/auth/google/start") {
      const redirectUrl = await createGoogleOAuthRedirect(req);
      res.writeHead(302, { Location: redirectUrl });
      res.end();
      return;
    }
    if (req.method === "GET" && req.url.startsWith("/api/auth/google/callback")) {
      const user = await handleGoogleCallback(req);
      const params = new URLSearchParams({
        googleAuth: "1",
        email: user.email,
        name: user.name || "",
      });
      res.writeHead(302, { Location: `/index.html?${params.toString()}` });
      res.end();
      return;
    }
    if (req.method === "POST" && req.url === "/api/auth/register") {
      const body = await getBody(req);
      const result = await registerUser(body, req);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/auth/login") {
      const body = await getBody(req);
      const result = await loginUser(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/auth/resend-verification") {
      const body = await getBody(req);
      const result = await resendVerification(body, req);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/auth/change-password") {
      const body = await getBody(req);
      const result = await changePassword(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/auth/delete-account") {
      const body = await getBody(req);
      const result = await deleteAccount(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "GET" && req.url === "/api/admin/status") {
      sendJson(res, 200, { ok: true, ...(await adminStatus()) });
      return;
    }
    if (req.method === "POST" && req.url === "/api/admin/login") {
      const body = await getBody(req);
      const result = await adminLogin(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "GET" && req.url === "/api/admin/settings") {
      requireAdmin(req);
      sendJson(res, 200, { ok: true, settings: await readAdminSettings() });
      return;
    }
    if (req.method === "POST" && req.url === "/api/admin/settings") {
      requireAdmin(req);
      const body = await getBody(req);
      sendJson(res, 200, { ok: true, settings: await saveAdminSettings(body.settings || body) });
      return;
    }
    if (req.method === "GET" && req.url.startsWith("/api/auth/verify")) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const verified = await verifyUser(url.searchParams.get("token"));
      res.writeHead(302, { Location: `/index.html?verified=${verified ? "1" : "0"}` });
      res.end();
      return;
    }
    if (req.method === "POST" && req.url === "/api/generate-image") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await generateImage(body);
      if (typeof result === "object" && result.pending) {
        sendJson(res, 202, { ok: true, pending: true, message: result.message });
      } else {
        sendJson(res, 200, { ok: true, imageUrl: result });
      }
      return;
    }
    if (req.method === "POST" && req.url === "/api/generate-local-video") {
      const body = await getBody(req);
      const result = await callLocalVideo(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/generate-byteplus-video") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await callBytePlusVideo(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/generate-cloud-video") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await callCloudVideo(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/check-google-veo-video") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await checkGoogleVeoVideo(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/test-local-video") {
      const body = await getBody(req);
      await testLocalVideo(body);
      sendJson(res, 200, { ok: true });
      return;
    }
    if (req.method === "POST" && req.url === "/api/test-byteplus") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await testBytePlus(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/query-byteplus-task") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await queryBytePlusTask(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "GET" && req.url.startsWith("/api/download-video")) {
      await proxyVideoDownload(req, res);
      return;
    }
    if (req.method === "POST" && req.url === "/api/test-cloud-video") {
      const body = await withAdminApiSettings(await getBody(req));
      await testCloudVideo(body);
      sendJson(res, 200, { ok: true });
      return;
    }
    if (req.method === "POST" && req.url === "/api/test-provider") {
      const body = await withAdminApiSettings(await getBody(req));
      await testProvider(body);
      sendJson(res, 200, { ok: true });
      return;
    }
    if (req.method === "POST" && req.url === "/api/optimize-prompt") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await optimizePrompt(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/generate-copy-chat") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await generateCopyChat(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/storyboard-script") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await generateStoryboardScript(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/storyboard-panels") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await generateStoryboardPanels(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/marketing-workflow") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await runMarketingWorkflow(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "GET" && req.url.startsWith("/api/marketing-news")) {
      const result = await fetchMarketingNews();
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.method === "POST" && req.url === "/api/marketing-copy-check") {
      const body = await withAdminApiSettings(await getBody(req));
      const result = await checkMarketingCopy(body);
      sendJson(res, 200, { ok: true, ...result });
      return;
    }
    if (req.url.startsWith("/api/")) {
      sendJson(res, 404, { ok: false, error: `API not found: ${req.url}. 请重启本地后端 npm start。` });
      return;
    }
    await serveStatic(req, res);
  } catch (error) {
    if (req.url.startsWith("/api/auth/google/")) {
      const params = new URLSearchParams({ googleError: String(error.message || error).slice(0, 300) });
      res.writeHead(302, { Location: `/index.html?${params.toString()}` });
      res.end();
      return;
    }
    sendJson(res, 500, { ok: false, error: String(error.message || error).slice(0, 600) });
  }
});

if (require.main === module) {
  server.listen(port, host, () => {
    console.log(`DreamForge server running at http://${host}:${port}`);
  });
}

module.exports = {
  server,
  host,
};
