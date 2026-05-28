const state = {
  authMode: "login",
  authProvider: "email",
  currentUser: null,
  isAuthed: false,
  currentMode: "image",
  currentScene: "",
  currentProjectId: "p1",
  filter: "all",
  favoritePreview: false,
  isGenerating: false,
  generationAbortRequested: false,
  activeAbortController: null,
  progressTimer: null,
  searchResults: [],
  uploads: [],
  activeUpload: null,
  activeUploads: [],
  copyAttachments: [],
  projectsLoaded: false,
  assetFilter: "image",
  marketingStage: "copy",
  marketingStoryboard: [],
  eyeComfort: false,
  settings: {
    keys: {
      openai: "",
      stability: "",
      fal: "",
      replicate: "",
      google: "",
      ideogram: "",
      leonardo: "",
      byteplus: "",
      anthropic: "",
      deepseek: "",
      qwen: "",
      xai: "",
      openrouter: "",
      mistral: "",
      cohere: "",
      perplexity: "",
      moonshot: "",
      zhipu: "",
      groq: "",
      together: "",
      fireworks: "",
      nvidia: "",
      cerebras: "",
      sambanova: "",
      ai21: "",
      baidu: "",
      minimax: "",
      yi: "",
    },
    imageProvider: "openai",
    imageModel: "gpt-image-2",
    videoProvider: "byteplus",
    videoModel: "BytePlus Seedance 1.5 Pro",
    videoApiKeys: {},
    videoEndpoints: {},
    videoEndpoint: "",
    imageSize: "1024x1024",
    imageQuality: "auto",
    customSize: {
      width: 1024,
      height: 1024,
      unit: "px",
      dpi: 300,
      base: 16,
    },
    localVideoModel: "Local Wan 2.2 TI2V 5B FP16",
    localVideoDirectory: "/Users/user/Documents/wan2.2",
    localVideoPath: "/Users/user/Documents/wan2.2/wan2.2_ti2v_5B_fp16.safetensors",
    localTextWorkflow: "/Users/user/Documents/wan2.2/text_to_video_wan22_5B.json",
    localImageWorkflow: "/Users/user/Documents/wan2.2/image_to_video_wan22_5B.json",
    localVideoEndpoint: "http://127.0.0.1:8188/prompt",
    localVideoToken: "",
    localVideoMethod: "ComfyUI Prompt",
    byteplusEndpoint: "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks",
    byteplusWorkspaceId: "",
    webhook: "",
  },
  projects: [
    {
      id: "p1",
      title: "霓虹雨夜舞者",
      mode: "图片生成影片",
      model: "BytePlus Seedance 1.5 Pro",
      time: "刚刚",
      favorite: true,
      prompt: "夜晚雨后的上海街头，一位穿银色外套的舞者穿过霓虹灯，镜头缓慢推进，电影级灯光，真实运动模糊",
    },
    {
      id: "p2",
      title: "香水产品广告",
      mode: "图片生成影片",
      model: "Kling 3 Pro",
      time: "12 分钟前",
      favorite: false,
      prompt: "透明香水瓶在黑曜石台面上旋转，金色微光扫过瓶身，水雾缓慢散开",
    },
  ],
  logs: [],
};

const videoModels = [
  "BytePlus Seedance 1.0 Pro Fast",
  "BytePlus Seedance 1.0 Pro",
  "BytePlus Seedance 1.0 Lite T2V",
  "BytePlus Seedance 1.0 Lite I2V",
  "BytePlus Seedance 1.5 Pro",
  "Kling 3 Pro",
  "Sora 2 Cinematic",
  "Runway Gen-4",
  "Pika Turbo",
];

const videoProviders = {
  runway: {
    label: "Runway",
    endpoint: "https://api.dev.runwayml.com/v1/text_to_video",
    models: ["Runway Gen-4.5", "Runway Gen-4 Turbo", "Runway Gen-3 Alpha Turbo"],
  },
  kling: {
    label: "Kling AI",
    endpoint: "https://api.klingai.com/v1/videos/text2video",
    models: ["Kling 3.0", "Kling 2.6", "Kling 2.1 Master", "Kling 1.6 Pro"],
  },
  luma: {
    label: "Luma AI",
    endpoint: "https://api.lumalabs.ai/dream-machine/v1/generations",
    models: ["Luma Ray3", "Luma Ray2", "Luma Ray Flash"],
  },
  pika: {
    label: "Pika",
    endpoint: "https://api.pika.art/v1/videos",
    models: ["Pika 2.2", "Pika 2.1", "Pika Turbo"],
  },
  openai: {
    label: "OpenAI Sora",
    endpoint: "https://api.openai.com/v1/videos",
    models: ["OpenAI Sora 2", "OpenAI Sora 2 Pro", "OpenAI Sora"],
  },
  minimax: {
    label: "MiniMax / Hailuo",
    endpoint: "https://api.minimax.io/v1/video_generation",
    models: ["Hailuo 02", "MiniMax Video-01", "MiniMax I2V-01"],
  },
  pixverse: {
    label: "PixVerse",
    endpoint: "https://app-api.pixverse.ai/openapi/v2/video/text/generate",
    models: ["PixVerse V5", "PixVerse V4.5", "PixVerse V4"],
  },
  vidu: {
    label: "Vidu",
    endpoint: "https://api.vidu.com/ent/v2/text2video",
    models: ["Vidu Q2", "Vidu 2.0", "Vidu 1.5"],
  },
  haiper: {
    label: "Haiper",
    endpoint: "https://api.haiper.ai/v1/video/generations",
    models: ["Haiper 2.5", "Haiper 2.0"],
  },
  ltx: {
    label: "LTX Studio",
    endpoint: "https://api.ltx.studio/v1/videos",
    models: ["LTX-2", "LTX-Video 0.9.8"],
  },
  replicate: {
    label: "Replicate Video",
    endpoint: "https://api.replicate.com/v1/predictions",
    models: ["Replicate Wan 2.2", "Replicate HunyuanVideo", "Replicate LTX-Video", "Replicate Stable Video Diffusion"],
  },
  fal: {
    label: "fal.ai Video",
    endpoint: "https://fal.run/fal-ai/wan/v2.2-a14b/text-to-video",
    models: ["fal Wan 2.2", "fal MiniMax Hailuo", "fal Kling Video", "fal LTX Video"],
  },
  byteplus: {
    label: "火山引擎 / Seedance",
    endpoint: "https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks",
    models: ["BytePlus Seedance 1.5 Pro", "BytePlus Seedance 1.0 Pro Fast", "BytePlus Seedance 1.0 Pro", "BytePlus Seedance 1.0 Lite T2V", "BytePlus Seedance 1.0 Lite I2V"],
  },
};

const cloudVideoModels = Object.values(videoProviders).flatMap((provider) => provider.models);
const cloudVideoModelMap = Object.fromEntries(
  Object.entries(videoProviders).flatMap(([providerKey, provider]) =>
    provider.models.map((model) => [model, providerKey])
  )
);

const localVideoModels = [
  "Local Wan 2.2 TI2V 5B FP16",
  "Local Wan 2.2 Video",
  "Local Wan 2.1 T2V",
  "Local HunyuanVideo",
  "Local LTX-Video",
  "Local CogVideoX",
  "Local Mochi 1",
  "Local Stable Video Diffusion",
  "Local AnimateDiff",
  "Local ComfyUI Workflow",
  "Local Custom Video Model",
];

const allVideoModels = [...cloudVideoModels, ...videoModels.filter((model) => !cloudVideoModels.includes(model)), ...localVideoModels];

const byteplusVideoModelIds = {
  "BytePlus Seedance 1.0 Pro Fast": "seedance-1-0-pro-fast-251015",
  "BytePlus Seedance 1.0 Pro": "seedance-1-0-pro-250528",
  "BytePlus Seedance 1.0 Lite T2V": "seedance-1-0-lite-t2v-250428",
  "BytePlus Seedance 1.0 Lite I2V": "seedance-1-0-lite-i2v-250428",
  "BytePlus Seedance 1.5 Pro": "seedance-1-5-pro-251215",
};

const imageProviders = {
  openai: {
    label: "OpenAI",
    keyField: "keyOpenai",
    models: ["gpt-image-2", "gpt-image-1.5", "gpt-image-1", "gpt-image-1-mini", "dall-e-3"],
  },
  stability: {
    label: "Stability AI",
    keyField: "keyStability",
    models: ["stable-image-ultra", "stable-image-core", "sd3.5-large", "sd3.5-large-turbo", "sd3.5-medium", "sd3.5-flash", "sdxl-1.0"],
  },
  fal: {
    label: "fal.ai",
    keyField: "keyFal",
    models: ["fal-ai/flux-pro/v1.1-ultra", "fal-ai/flux/dev", "fal-ai/bytedance/seedream/v4.5", "fal-ai/nano-banana", "fal-ai/ideogram/v3"],
  },
  replicate: {
    label: "Replicate",
    keyField: "keyReplicate",
    models: ["black-forest-labs/flux-1.1-pro", "black-forest-labs/flux-schnell", "stability-ai/sdxl", "ideogram-ai/ideogram-v3"],
  },
  google: {
    label: "Google AI",
    keyField: "keyGoogle",
    models: ["nano-banana", "imagen-4.0-generate-001", "imagen-4.0-ultra-generate-001", "gemini-3-pro-image-preview", "gemini-2.5-flash-image"],
  },
  ideogram: {
    label: "Ideogram",
    keyField: "keyIdeogram",
    models: ["ideogram-v3", "ideogram-v2a", "ideogram-v2"],
  },
  leonardo: {
    label: "Leonardo.Ai",
    keyField: "keyLeonardo",
    models: ["Phoenix 1.0", "Leonardo Kino XL", "Leonardo Vision XL", "AlbedoBase XL", "Lucid Origin"],
  },
  adobe: {
    label: "Adobe Firefly",
    models: ["Firefly Image 4 Ultra", "Firefly Image 4", "Firefly Image 3"],
  },
  bfl: {
    label: "Black Forest Labs",
    models: ["FLUX 1.1 Pro Ultra", "FLUX 1.1 Pro", "FLUX.1 Kontext", "FLUX.1 Schnell"],
  },
  recraft: {
    label: "Recraft",
    models: ["Recraft V3", "Recraft 20B", "Recraft SVG"],
  },
  clipdrop: {
    label: "Clipdrop",
    models: ["Stable Diffusion XL", "Uncrop", "Cleanup", "Replace Background"],
  },
  getimg: {
    label: "getimg.ai",
    models: ["Essential SDXL", "RealVisXL", "FLUX Schnell", "Image Editor"],
  },
  deepai: {
    label: "DeepAI",
    models: ["Text2Img", "HD Image Generator", "Fantasy World Generator"],
  },
};

const imageModelProviderMap = Object.fromEntries(
  Object.entries(imageProviders).flatMap(([providerKey, provider]) =>
    provider.models.map((model) => [model, providerKey])
  )
);
const allImageModels = Object.keys(imageModelProviderMap);

const llmProviders = {
  openai: {
    label: "OpenAI",
    models: ["gpt-5.5", "gpt-5.2", "gpt-5.2-pro", "gpt-5.1", "gpt-5", "gpt-5-mini", "gpt-5-nano", "gpt-4.1", "gpt-4.1-mini"],
  },
  google: {
    label: "Google Gemini",
    models: ["gemini-3.5-flash", "gemini-3-pro-preview", "gemini-3-flash-preview", "gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash"],
  },
  anthropic: {
    label: "Anthropic Claude",
    models: ["claude-opus-4-5", "claude-sonnet-4-5", "claude-haiku-4-5", "claude-3-5-sonnet-latest"],
  },
  deepseek: {
    label: "DeepSeek",
    models: ["deepseek-chat", "deepseek-reasoner"],
  },
  qwen: {
    label: "Qwen / 通义千问",
    models: ["qwen-max", "qwen-plus", "qwen-turbo", "qwen3-max", "qwen3-coder-plus"],
  },
  xai: {
    label: "xAI Grok",
    models: ["grok-4", "grok-3", "grok-3-mini"],
  },
  openrouter: {
    label: "OpenRouter",
    models: ["openai/gpt-5.5", "google/gemini-3-pro-preview", "anthropic/claude-sonnet-4.5", "deepseek/deepseek-chat", "meta-llama/llama-4-maverick"],
  },
  mistral: {
    label: "Mistral",
    models: ["mistral-large-latest", "pixtral-large-latest", "codestral-latest"],
  },
  cohere: {
    label: "Cohere",
    models: ["command-a-03-2025", "command-r-plus", "command-r"],
  },
  perplexity: {
    label: "Perplexity",
    models: ["sonar-pro", "sonar", "sonar-reasoning-pro"],
  },
  moonshot: {
    label: "Moonshot / Kimi",
    models: ["kimi-k2-0711-preview", "moonshot-v1-128k", "moonshot-v1-32k"],
  },
  zhipu: {
    label: "Zhipu / GLM",
    models: ["glm-4.5", "glm-4-plus", "glm-4-air"],
  },
  groq: {
    label: "Groq",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
  },
  together: {
    label: "Together AI",
    models: ["meta-llama/Llama-3.3-70B-Instruct-Turbo", "deepseek-ai/DeepSeek-V3", "Qwen/Qwen2.5-72B-Instruct-Turbo"],
  },
  fireworks: {
    label: "Fireworks AI",
    models: ["accounts/fireworks/models/llama-v3p1-405b-instruct", "accounts/fireworks/models/deepseek-v3", "accounts/fireworks/models/qwen2p5-72b-instruct"],
  },
  nvidia: {
    label: "NVIDIA NIM",
    models: ["meta/llama-3.1-405b-instruct", "nvidia/llama-3.1-nemotron-70b-instruct", "mistralai/mixtral-8x22b-instruct-v0.1"],
  },
  cerebras: {
    label: "Cerebras",
    models: ["llama3.1-70b", "llama3.1-8b"],
  },
  sambanova: {
    label: "SambaNova",
    models: ["Meta-Llama-3.1-405B-Instruct", "Meta-Llama-3.1-70B-Instruct", "DeepSeek-R1"],
  },
  ai21: {
    label: "AI21 Labs",
    models: ["jamba-large-1.7", "jamba-mini-1.7"],
  },
  baidu: {
    label: "Baidu ERNIE",
    models: ["ernie-4.5-turbo-128k", "ernie-4.0-turbo-8k"],
  },
  minimax: {
    label: "MiniMax",
    models: ["MiniMax-M1", "abab6.5s-chat"],
  },
  yi: {
    label: "01.AI Yi",
    models: ["yi-large", "yi-medium", "yi-spark"],
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const landing = $("#landing");
const workspace = $("#workspace");
const studioHome = $("#studioHome");
const authModal = $("#authModal");
const settingsModal = $("#settingsModal");
const authTitle = $("#authTitle");
const authSubtitle = $("#authSubtitle");
const nameField = $("#nameField");
const rememberField = $("#rememberField");
const rememberPasswordInput = $("#rememberPasswordInput");
const promptInput = $("#promptInput");
const negativeInput = $("#negativeInput");
const charCount = $("#charCount");
const projectList = $("#projectList");
const renderLog = $("#renderLog");
const uploadPanel = $("#uploadPanel");
const uploadTitle = $("#uploadTitle");
const uploadStatus = $("#uploadStatus");
const uploadTray = $("#uploadTray");
const previewStage = $("#previewStage");
const previewTitle = $("#previewTitle");
const previewMeta = $("#previewMeta");
const progressRing = $("#progressRing");
const generateBtn = $("#generateBtn");
const generateLabel = $("#generateLabel");
const pauseGenerationBtn = $("#pauseGenerationBtn");
const settingsSavedState = $("#settingsSavedState");
const verificationNotice = $("#verificationNotice");
const projectChatMessages = $("#projectChatMessages");
const projectChatInput = $("#projectChatInput");
const projectChatStatus = $("#projectChatStatus");
const assetsModal = $("#assetsModal");
const assetsGrid = $("#assetsGrid");
const marketingPanel = $("#marketingPanel");
const marketingAudience = $("#marketingAudience");
const marketingGoal = $("#marketingGoal");
const marketingChannel = $("#marketingChannel");
const marketingNewsList = $("#marketingNewsList");
const copywriterPanel = $("#copywriterPanel");
const copyLlmSelect = $("#copyLlmSelect");
const copyChatWindow = $("#copyChatWindow");
const copyChatInput = $("#copyChatInput");
const copyAttachmentInput = $("#copyAttachmentInput");
const copyAttachmentTray = $("#copyAttachmentTray");
const adminLoginModal = $("#adminLoginModal");
const adminPasswordInput = $("#adminPasswordInput");
let adminToken = localStorage.getItem("dreamforge-admin-token") || "";

function shouldShowToast(message) {
  return /失败|错误|请先|不可用|未启动|需要|不足|无效|没有|无法|不一致|至少|确认|空间/.test(message);
}

function toast(message, options = {}) {
  if (!options.force && !shouldShowToast(message)) return;
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  $("#toastHost").appendChild(item);
  setTimeout(() => item.remove(), 2800);
}

function maskKey(value) {
  if (!value) return "未配置";
  const tail = value.slice(-4);
  return `${"•".repeat(10)}${tail}`;
}

function seedanceRestApiKey() {
  return state.settings.videoApiKeys?.byteplus || state.settings.keys.byteplus || "";
}

function persistSettings() {
  const clean = {
    ...state.settings,
    keys: {},
    videoApiKeys: {},
  };
  localStorage.setItem("dreamforge-settings", JSON.stringify(clean));
}

function currentSeedanceInputKey() {
  if ($("#videoProviderSetting")?.value === "byteplus") return $("#videoProviderKeySetting").value.trim();
  return $('[data-api-key-input="video:byteplus"]')?.value.trim() || $("#keyByteplus")?.value.trim() || "";
}

function seedanceReferenceImageUrls() {
  const images = (state.activeUploads?.length ? state.activeUploads : state.activeUpload ? [state.activeUpload] : [])
    .filter((file) => file?.dataUrl && file.kind === "image");
  return images.map((file) => {
    const size = dataUrlByteSize(file.dataUrl);
    if (size > SEEDANCE_MAX_IMAGE_BYTES || file.dataUrl.length > SEEDANCE_MAX_IMAGE_DATA_URL_CHARS) {
      throw new Error(`参考图片 ${file.name || ""} 仍然过大：${(size / 1024 / 1024).toFixed(2)} MB。请换一张更小的图片，或先裁剪后再上传。`);
    }
    return file.dataUrl;
  });
}

function syncSeedanceRestSettings(sourceKey) {
  const key = String(arguments.length ? sourceKey : seedanceRestApiKey()).trim();
  state.settings.videoApiKeys = { ...(state.settings.videoApiKeys || {}) };
  if (key) {
    state.settings.keys.byteplus = key;
    state.settings.videoApiKeys.byteplus = key;
  } else {
    delete state.settings.keys.byteplus;
    delete state.settings.videoApiKeys.byteplus;
  }
  state.settings.videoEndpoints = {
    ...(state.settings.videoEndpoints || {}),
    byteplus: state.settings.videoEndpoints?.byteplus || state.settings.byteplusEndpoint || videoProviders.byteplus.endpoint,
  };
  const mainKeyInput = $("#keyByteplus");
  const videoKeyInput = $("#videoProviderKeySetting");
  const directoryKeyInput = $('[data-api-key-input="video:byteplus"]');
  if (mainKeyInput) mainKeyInput.value = key;
  if (videoKeyInput && state.settings.videoProvider === "byteplus") videoKeyInput.value = key;
  if (directoryKeyInput) directoryKeyInput.value = key;
}

function deleteApiProviderKey(type, providerKey) {
  if (type === "video") {
    state.settings.videoApiKeys = { ...(state.settings.videoApiKeys || {}) };
    delete state.settings.videoApiKeys[providerKey];
    const input = $(`[data-api-key-input="video:${providerKey}"]`);
    if (input) input.value = "";
    if (state.settings.videoProvider === providerKey) $("#videoProviderKeySetting").value = "";
    if (providerKey === "byteplus") {
      delete state.settings.keys.byteplus;
      $("#keyByteplus").value = "";
    }
  } else {
    delete state.settings.keys[providerKey];
    const input = $(`[data-api-key-input="${type}:${providerKey}"]`);
    if (input) input.value = "";
    const provider = type === "image" ? imageProviders[providerKey] : type === "llm" ? llmProviders[providerKey] : null;
    if (provider?.keyField) $(`#${provider.keyField}`).value = "";
    if (type === "llm") {
      const imageProvider = imageProviders[providerKey];
      if (imageProvider?.keyField) $(`#${imageProvider.keyField}`).value = "";
      const imageInput = $(`[data-api-key-input="image:${providerKey}"]`);
      if (imageInput) imageInput.value = "";
    }
    if (type === "image") {
      const llmInput = $(`[data-api-key-input="llm:${providerKey}"]`);
      if (llmInput) llmInput.value = "";
    }
  }
  persistSettings();
  updateKeyStatus();
  updateVideoApiStatus();
}

function populateImageSettings() {
  const providerSelect = $("#imageProviderSetting");
  providerSelect.innerHTML = Object.entries(imageProviders)
    .map(([value, item]) => `<option value="${value}">${item.label}</option>`)
    .join("");
  providerSelect.value = state.settings.imageProvider;
  populateImageModels();
}

function populateImageModels() {
  const provider = imageProviders[state.settings.imageProvider] || imageProviders.openai;
  const modelSelect = $("#imageModelSetting");
  modelSelect.innerHTML = provider.models.map((model) => `<option>${model}</option>`).join("");
  if (!provider.models.includes(state.settings.imageModel)) {
    state.settings.imageModel = provider.models[0];
  }
  modelSelect.value = state.settings.imageModel;
}

function populateVideoSettings() {
  const providerSelect = $("#videoProviderSetting");
  providerSelect.innerHTML = Object.entries(videoProviders)
    .map(([value, item]) => `<option value="${value}">${item.label}</option>`)
    .join("");
  if (!videoProviders[state.settings.videoProvider]) state.settings.videoProvider = "byteplus";
  providerSelect.value = state.settings.videoProvider;
  populateVideoModels();
  $("#videoProviderKeySetting").value = state.settings.videoProvider === "byteplus"
    ? seedanceRestApiKey()
    : state.settings.videoApiKeys[state.settings.videoProvider] || "";
  $("#videoEndpointSetting").value =
    state.settings.videoEndpoints?.[state.settings.videoProvider] ||
    state.settings.videoEndpoint ||
    (videoProviders[state.settings.videoProvider] || videoProviders.byteplus).endpoint;
  updateVideoApiStatus();
}

function populateVideoModels() {
  const provider = videoProviders[state.settings.videoProvider] || videoProviders.runway;
  const modelSelect = $("#videoModelSetting");
  modelSelect.innerHTML = provider.models.map((model) => `<option>${model}</option>`).join("");
  if (!provider.models.includes(state.settings.videoModel)) {
    state.settings.videoModel = provider.models[0];
  }
  modelSelect.value = state.settings.videoModel;
}

function updateVideoApiStatus() {
  const saved = Object.entries(videoProviders)
    .filter(([key]) => key === "byteplus" ? seedanceRestApiKey() : state.settings.videoApiKeys[key])
    .map(([, provider]) => provider.label);
  $("#videoApiStatus").textContent = saved.length
    ? `已保存 Key：${saved.join("、")}`
    : "Runway、Kling、Luma、Pika、OpenAI Sora、MiniMax / Hailuo、PixVerse、Vidu、Haiper、LTX Studio、Replicate、fal.ai、BytePlus Seedance。";
}

function renderApiDirectory() {
  const imageHost = $("#imageApiDirectory");
  const videoHost = $("#videoApiDirectory");
  const llmHost = $("#llmApiDirectory");
  if (imageHost) imageHost.innerHTML = renderProviderGroup("image", Object.entries(imageProviders), "图片 API");
  if (videoHost) videoHost.innerHTML = renderProviderGroup("video", Object.entries(videoProviders), "影片 API");
  if (llmHost) llmHost.innerHTML = renderProviderGroup("llm", Object.entries(llmProviders), "大语言模型 LLM");
}

function renderProviderGroup(type, providers, title) {
  return `
    <section class="api-group-card">
      <div class="api-group-title">
        <strong>${title}</strong>
        <span>${providers.length} 个 API Key</span>
      </div>
      <div class="api-group-rows">
        ${providers.map(([key, provider]) => renderProviderRow(type, key, provider)).join("")}
      </div>
    </section>
  `;
}

function renderProviderRow(type, key, provider) {
  const savedKey = type === "video"
    ? (key === "byteplus" ? seedanceRestApiKey() : state.settings.videoApiKeys[key] || "")
    : state.settings.keys[key] || "";
  const savedEndpoint = type === "video"
    ? (state.settings.videoEndpoints?.[key] || provider.endpoint || "")
    : (provider.endpoint || "");
  return `
    <article class="api-provider-card">
      <div class="api-provider-head">
        <div>
          <strong>${provider.label}</strong>
          <small>${type === "video" ? "影片生成 API" : type === "llm" ? `LLM 对话 API · ${provider.models.join(" / ")}` : "图片生成 API"}</small>
        </div>
      </div>
      <label class="api-key-line">
        <span>API Key</span>
        <span class="api-secret-control">
          <input type="password" data-api-key-input="${type}:${key}" value="${savedKey}" placeholder="${provider.label} - 填入 API Key" />
          <button type="button" data-action="toggle-api-secret" data-api-key-target="${type}:${key}">显示</button>
        </span>
      </label>
      ${type === "video" ? `
        <label class="api-key-line api-endpoint-line">
          <span>Endpoint</span>
          <input type="url" data-api-endpoint-input="${key}" value="${savedEndpoint}" placeholder="${provider.label} Endpoint" />
        </label>
      ` : ""}
      <div class="api-provider-actions">
        <button type="button" class="api-test-btn" data-action="test-api-provider" data-api-type="${type}" data-provider-key="${key}">测试</button>
        <button type="button" class="api-delete-btn" data-action="delete-api-provider-key" data-api-type="${type}" data-provider-key="${key}" aria-label="删除 ${provider.label} API Key">删除</button>
      </div>
    </article>
  `;
}

function consolidateApiSettingsPanel() {
  const keysSection = $('[data-settings-section="keys"]');
  const imageSection = $('[data-settings-section="imageapi"]');
  const videoSection = $('[data-settings-section="videoapi"]');
  if (!keysSection || !imageSection || !videoSection || $("#combinedApiPanel")) return;

  const panel = document.createElement("div");
  panel.id = "combinedApiPanel";
  panel.className = "combined-api-panel";

  const imageHead = document.createElement("div");
  imageHead.className = "combined-api-head";
  imageHead.innerHTML = `
    <h3>图片 API Keys</h3>
    <p>只填写图片生成服务商的 API Key，然后点击测试确认连接。</p>
  `;
  panel.appendChild(imageHead);

  const imageWrap = document.createElement("div");
  imageWrap.className = "combined-api-group";
  const imageDirectory = imageSection.querySelector(".api-directory");
  if (imageDirectory) imageWrap.appendChild(imageDirectory);
  panel.appendChild(imageWrap);

  const videoHead = document.createElement("div");
  videoHead.className = "combined-api-head";
  videoHead.innerHTML = `
    <h3>影片 API Keys</h3>
    <p>每一个影片模型下面都可以填写 API Key 和 Endpoint，然后点击测试确认连接。</p>
  `;
  panel.appendChild(videoHead);

  const videoWrap = document.createElement("div");
  videoWrap.className = "combined-api-group";
  const videoDirectory = videoSection.querySelector(".api-directory");
  if (videoDirectory) videoWrap.appendChild(videoDirectory);
  panel.appendChild(videoWrap);

  keysSection.appendChild(panel);
}

function collectApiDirectoryKeys() {
  $$("[data-api-key-input]").forEach((input) => {
    const [type, key] = input.dataset.apiKeyInput.split(":");
    const value = input.value.trim();
    if (type === "video") {
      state.settings.videoApiKeys = { ...(state.settings.videoApiKeys || {}) };
      if (value) state.settings.videoApiKeys[key] = value;
      else delete state.settings.videoApiKeys[key];
      if (key === "byteplus") {
        if (value) state.settings.keys.byteplus = value;
        else delete state.settings.keys.byteplus;
      }
    } else {
      if (value) state.settings.keys[key] = value;
      else delete state.settings.keys[key];
    }
  });
  state.settings.videoEndpoints = state.settings.videoEndpoints || {};
  $$("[data-api-endpoint-input]").forEach((input) => {
    state.settings.videoEndpoints[input.dataset.apiEndpointInput] = input.value.trim();
  });
  updateKeyStatus();
  updateVideoApiStatus();
}

function populateWorkspaceModels() {
  const models = state.currentMode === "imagegen" ? allImageModels : allVideoModels;
  const currentModel = $("#modelSelect").value;
  const preferredModel = state.currentMode === "imagegen"
    ? state.settings.imageModel
    : currentModel || state.settings.videoModel || state.settings.localVideoModel;
  $("#modelSelect").innerHTML = models.map((model) => `<option>${model}</option>`).join("");
  $("#modelSelect").value = models.includes(preferredModel) ? preferredModel : models[0];
}

function populateLocalVideoSettings() {
  $("#localVideoModelSetting").innerHTML = localVideoModels.map((model) => `<option>${model}</option>`).join("");
  $("#localVideoModelSetting").value = state.settings.localVideoModel;
}

function isLocalVideoModel(model) {
  return localVideoModels.includes(model);
}

function isBytePlusVideoModel(model) {
  return Object.prototype.hasOwnProperty.call(byteplusVideoModelIds, model);
}

function isCloudVideoModel(model) {
  return Object.prototype.hasOwnProperty.call(cloudVideoModelMap, model);
}

function convertToPixels(value, unit, dpi, base, viewportAxis = 1440) {
  const numeric = Number(value || 0);
  const safeDpi = Number(dpi || 300);
  const safeBase = Number(base || 16);
  const units = {
    px: numeric,
    cm: (numeric / 2.54) * safeDpi,
    mm: (numeric / 25.4) * safeDpi,
    in: numeric * safeDpi,
    pt: (numeric / 72) * safeDpi,
    pc: (numeric / 6) * safeDpi,
    dp: numeric,
    rem: numeric * safeBase,
    em: numeric * safeBase,
    vw: (numeric / 100) * viewportAxis,
    vh: (numeric / 100) * 900,
  };
  return Math.max(64, Math.round(units[unit] || numeric));
}

function getImagePixelSize() {
  if (state.settings.imageSize !== "custom") return state.settings.imageSize;
  const custom = state.settings.customSize;
  const width = convertToPixels(custom.width, custom.unit, custom.dpi, custom.base, 1440);
  const height = convertToPixels(custom.height, custom.unit, custom.dpi, custom.base, 900);
  return `${width}x${height}`;
}

function getSelectedPixelSize() {
  const selected = $("#ratioSelect").value;
  if (selected === "custom") {
    const width = Math.max(64, Math.min(4096, Number($("#generatorCustomWidth").value || 1080)));
    const height = Math.max(64, Math.min(4096, Number($("#generatorCustomHeight").value || 1920)));
    return `${width}x${height}`;
  }
  return selected;
}

function isSafeModeEnabled() {
  return Boolean($("#safeMode")?.checked);
}

function getSelectedSizeLabel() {
  const select = $("#ratioSelect");
  if (select.value === "custom") return `${getSelectedPixelSize()} · 自定义`;
  return select.options[select.selectedIndex]?.textContent || select.value;
}

function getSelectedAspectRatio() {
  const [width, height] = getSelectedPixelSize().split("x").map(Number);
  if (!width || !height) return "9:16";
  const divisor = (function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  })(width, height);
  return `${Math.round(width / divisor)}:${Math.round(height / divisor)}`;
}

function updateGeneratorSizeControls() {
  const isCustom = $("#ratioSelect").value === "custom";
  $("#generatorCustomSize").hidden = !isCustom;
  const size = getSelectedPixelSize();
  $("#generatorSizePreview").textContent = `${size.replace("x", " × ")} px`;
}

function updateCustomSizePreview() {
  if (!$("#customPixelPreview")) return;
  const width = Number($("#customWidthSetting").value || 1024);
  const height = Number($("#customHeightSetting").value || 1024);
  const unit = $("#customUnitSetting").value;
  const dpi = Number($("#customDpiSetting").value || 300);
  const base = Number($("#customBaseSetting").value || 16);
  const pixelWidth = convertToPixels(width, unit, dpi, base, 1440);
  const pixelHeight = convertToPixels(height, unit, dpi, base, 900);
  $("#customPixelPreview").textContent = `${pixelWidth} × ${pixelHeight} px`;
  $("#customSizePanel").classList.toggle("is-muted", $("#imageSizeSetting").value !== "custom");
}

function loadSettings() {
  consolidateApiSettingsPanel();
  const saved = localStorage.getItem("dreamforge-settings");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      parsed.keys = {};
      parsed.videoApiKeys = {};
      localStorage.setItem("dreamforge-settings", JSON.stringify(parsed));
      const currentKeys = { ...(state.settings.keys || {}) };
      const currentVideoApiKeys = { ...(state.settings.videoApiKeys || {}) };
      state.settings = {
        ...state.settings,
        ...parsed,
        keys: currentKeys,
        videoApiKeys: currentVideoApiKeys,
      };
      if (state.settings.imageProvider === "openai" && state.settings.imageModel !== "gpt-image-2") {
        state.settings.imageModel = "gpt-image-2";
      }
      if (
        String(state.settings.byteplusEndpoint || "").includes("prompt-pilot.ap-southeast.bytepluses.com")
        || String(state.settings.byteplusEndpoint || "").includes("ark.cn-beijing.volces.com")
      ) {
        state.settings.byteplusEndpoint = videoProviders.byteplus.endpoint;
      }
      if (
        !state.settings.videoEndpoints
        || String(state.settings.videoEndpoints.byteplus || "").includes("prompt-pilot.ap-southeast.bytepluses.com")
        || String(state.settings.videoEndpoints.byteplus || "").includes("ark.cn-beijing.volces.com")
      ) {
        state.settings.videoEndpoints = {
          ...(state.settings.videoEndpoints || {}),
          byteplus: videoProviders.byteplus.endpoint,
        };
      }
      if (!videoProviders[state.settings.videoProvider] || state.settings.videoProvider === "google") {
        state.settings.videoProvider = "byteplus";
        state.settings.videoModel = "BytePlus Seedance 1.5 Pro";
        state.settings.videoEndpoint = videoProviders.byteplus.endpoint;
      }
      syncSeedanceRestSettings();
    } catch {
      toast("设置读取失败，已使用默认值");
    }
  } else {
    syncSeedanceRestSettings();
  }
  $("#keyOpenai").value = state.settings.keys.openai;
  $("#keyStability").value = state.settings.keys.stability;
  $("#keyFal").value = state.settings.keys.fal;
  $("#keyReplicate").value = state.settings.keys.replicate;
  $("#keyGoogle").value = state.settings.keys.google;
  $("#keyIdeogram").value = state.settings.keys.ideogram;
  $("#keyLeonardo").value = state.settings.keys.leonardo;
  $("#keyByteplus").value = state.settings.keys.byteplus;
  $("#keyAnthropic").value = state.settings.keys.anthropic || "";
  $("#keyDeepseek").value = state.settings.keys.deepseek || "";
  $("#keyQwen").value = state.settings.keys.qwen || "";
  $("#keyXai").value = state.settings.keys.xai || "";
  $("#keyOpenrouter").value = state.settings.keys.openrouter || "";
  $("#keyMistral").value = state.settings.keys.mistral || "";
  $("#keyCohere").value = state.settings.keys.cohere || "";
  $("#keyPerplexity").value = state.settings.keys.perplexity || "";
  $("#keyMoonshot").value = state.settings.keys.moonshot || "";
  $("#keyZhipu").value = state.settings.keys.zhipu || "";
  populateImageSettings();
  populateVideoSettings();
  populateLocalVideoSettings();
  renderApiDirectory();
  $("#imageSizeSetting").value = state.settings.imageSize;
  $("#imageQualitySetting").value = state.settings.imageQuality;
  $("#customWidthSetting").value = state.settings.customSize.width;
  $("#customHeightSetting").value = state.settings.customSize.height;
  $("#customUnitSetting").value = state.settings.customSize.unit;
  $("#customDpiSetting").value = state.settings.customSize.dpi;
  $("#customBaseSetting").value = state.settings.customSize.base;
  $("#localVideoModelSetting").value = state.settings.localVideoModel;
  $("#localVideoDirectorySetting").value = state.settings.localVideoDirectory;
  $("#localVideoPathSetting").value = state.settings.localVideoPath;
  $("#localTextWorkflowSetting").value = state.settings.localTextWorkflow;
  $("#localImageWorkflowSetting").value = state.settings.localImageWorkflow;
  $("#localVideoEndpointSetting").value = state.settings.localVideoEndpoint;
  $("#localVideoTokenSetting").value = state.settings.localVideoToken;
  $("#localVideoMethodSetting").value = state.settings.localVideoMethod;
  $("#byteplusEndpointSetting").value = state.settings.byteplusEndpoint;
  $("#byteplusWorkspaceSetting").value = state.settings.byteplusWorkspaceId;
  $("#webhookSetting").value = state.settings.webhook;
  updateSecurityAccount();
  updateKeyStatus();
  updateCustomSizePreview();
  refreshWorkspaceModels();
}

function collectSettings() {
  const selectedVideoProvider = $("#videoProviderSetting").value;
  const selectedVideoKey = $("#videoProviderKeySetting").value.trim();
  const seedanceKey = selectedVideoProvider === "byteplus"
    ? selectedVideoKey
    : currentSeedanceInputKey();
  state.settings = {
    keys: {
      ...state.settings.keys,
      openai: $("#keyOpenai").value.trim(),
      stability: $("#keyStability").value.trim(),
      fal: $("#keyFal").value.trim(),
      replicate: $("#keyReplicate").value.trim(),
      google: $("#keyGoogle").value.trim(),
      ideogram: $("#keyIdeogram").value.trim(),
      leonardo: $("#keyLeonardo").value.trim(),
      byteplus: seedanceKey,
      anthropic: $("#keyAnthropic").value.trim(),
      deepseek: $("#keyDeepseek").value.trim(),
      qwen: $("#keyQwen").value.trim(),
      xai: $("#keyXai").value.trim(),
      openrouter: $("#keyOpenrouter").value.trim(),
      mistral: $("#keyMistral").value.trim(),
      cohere: $("#keyCohere").value.trim(),
      perplexity: $("#keyPerplexity").value.trim(),
      moonshot: $("#keyMoonshot").value.trim(),
      zhipu: $("#keyZhipu").value.trim(),
      groq: state.settings.keys.groq || "",
      together: state.settings.keys.together || "",
      fireworks: state.settings.keys.fireworks || "",
      nvidia: state.settings.keys.nvidia || "",
      cerebras: state.settings.keys.cerebras || "",
      sambanova: state.settings.keys.sambanova || "",
      ai21: state.settings.keys.ai21 || "",
      baidu: state.settings.keys.baidu || "",
      minimax: state.settings.keys.minimax || "",
      yi: state.settings.keys.yi || "",
    },
    imageProvider: $("#imageProviderSetting").value,
    imageModel: $("#imageModelSetting").value,
    videoProvider: selectedVideoProvider,
    videoModel: $("#videoModelSetting").value,
    videoApiKeys: {
      ...state.settings.videoApiKeys,
      byteplus: seedanceKey,
      [selectedVideoProvider]: selectedVideoKey,
    },
    videoEndpoints: {
      ...(state.settings.videoEndpoints || {}),
      [selectedVideoProvider]: $("#videoEndpointSetting").value.trim(),
    },
    videoEndpoint: $("#videoEndpointSetting").value.trim(),
    imageSize: $("#imageSizeSetting").value,
    imageQuality: $("#imageQualitySetting").value,
    customSize: {
      width: Number($("#customWidthSetting").value || 1024),
      height: Number($("#customHeightSetting").value || 1024),
      unit: $("#customUnitSetting").value,
      dpi: Number($("#customDpiSetting").value || 300),
      base: Number($("#customBaseSetting").value || 16),
    },
    localVideoModel: $("#localVideoModelSetting").value,
    localVideoDirectory: $("#localVideoDirectorySetting").value.trim(),
    localVideoPath: $("#localVideoPathSetting").value.trim(),
    localTextWorkflow: $("#localTextWorkflowSetting").value.trim(),
    localImageWorkflow: $("#localImageWorkflowSetting").value.trim(),
    localVideoEndpoint: $("#localVideoEndpointSetting").value.trim(),
    localVideoToken: $("#localVideoTokenSetting").value.trim(),
    localVideoMethod: $("#localVideoMethodSetting").value,
    byteplusEndpoint: $("#byteplusEndpointSetting").value.trim(),
    byteplusWorkspaceId: $("#byteplusWorkspaceSetting").value.trim(),
    webhook: $("#webhookSetting").value.trim(),
  };
  syncSeedanceRestSettings(seedanceKey);
}

function updateKeyStatus() {
  const keys = state.settings.keys;
  $("#keyStatus").textContent = Object.entries(imageProviders)
    .map(([key, item]) => `${item.label}: ${maskKey(keys[key])}`)
    .concat([
      `BytePlus: ${maskKey(keys.byteplus)}`,
      `Claude: ${maskKey(keys.anthropic)}`,
      `DeepSeek: ${maskKey(keys.deepseek)}`,
      `Qwen: ${maskKey(keys.qwen)}`,
      `xAI: ${maskKey(keys.xai)}`,
      `OpenRouter: ${maskKey(keys.openrouter)}`,
      `Mistral: ${maskKey(keys.mistral)}`,
      `Cohere: ${maskKey(keys.cohere)}`,
      `Perplexity: ${maskKey(keys.perplexity)}`,
      `Moonshot: ${maskKey(keys.moonshot)}`,
      `Zhipu: ${maskKey(keys.zhipu)}`,
      `Groq: ${maskKey(keys.groq)}`,
      `Together: ${maskKey(keys.together)}`,
      `Fireworks: ${maskKey(keys.fireworks)}`,
      `NVIDIA: ${maskKey(keys.nvidia)}`,
      `Cerebras: ${maskKey(keys.cerebras)}`,
      `SambaNova: ${maskKey(keys.sambanova)}`,
      `AI21: ${maskKey(keys.ai21)}`,
      `Baidu: ${maskKey(keys.baidu)}`,
      `MiniMax: ${maskKey(keys.minimax)}`,
      `Yi: ${maskKey(keys.yi)}`,
    ])
    .join(" · ");
}

function refreshWorkspaceModels() {
  populateWorkspaceModels();
}

function renderUploadTray() {
  if (!uploadTray) return;
  const items = state.activeUploads || [];
  uploadTray.hidden = items.length === 0;
  uploadTray.innerHTML = items.map((file, index) => {
    const label = `素材 ${index + 1}`;
    const size = file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : file.type || "素材";
    return `
      <article class="upload-chip" role="button" tabindex="0" data-action="preview-upload-asset" data-upload-id="${file.id}" aria-label="预览 ${label}">
        <button type="button" class="upload-chip-remove" data-action="remove-upload-asset" data-upload-id="${file.id}" aria-label="删除 ${label}">×</button>
        <div class="upload-chip-preview">
          ${/^image\//.test(file.type || "") && file.dataUrl ? `<img src="${file.dataUrl}" alt="${label}" />` : `<span>${/^video\//.test(file.type || "") ? "MP4" : /^audio\//.test(file.type || "") ? "AUDIO" : "FILE"}</span>`}
        </div>
        <div>
          <strong>${label}</strong>
          <small>${file.name}</small>
          <em>${size}</em>
        </div>
      </article>
    `;
  }).join("");
}

function updateUploadSummary() {
  const imageCount = state.activeUploads.filter((file) => /^image\//.test(file.type || "")).length;
  const totalCount = state.activeUploads.length;
  const totalMb = state.activeUploads
    .reduce((sum, file) => sum + (file.size || 0), 0) / 1024 / 1024;
  uploadStatus.hidden = totalCount === 0;
  uploadStatus.textContent = totalCount
    ? `已上传 ${totalCount} 个素材 · ${totalMb.toFixed(2)} MB · ${imageCount} 张参考图`
    : "";
  const referenceCount = $("#referenceCount");
  if (referenceCount) referenceCount.textContent = `${imageCount} 张`;
  renderUploadTray();
}

function closeUploadPreview() {
  const modal = $("#uploadPreviewModal");
  if (!modal) return;
  modal.hidden = true;
  $("#uploadPreviewBody").innerHTML = "";
}

function previewUploadAsset(id) {
  const file = state.activeUploads.find((item) => item.id === id);
  if (!file) return;
  const modal = $("#uploadPreviewModal");
  const body = $("#uploadPreviewBody");
  const title = $("#uploadPreviewTitle");
  const meta = $("#uploadPreviewMeta");
  const size = file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "未记录容量";
  title.textContent = file.name || "素材预览";
  meta.textContent = `${file.kind || "上传素材"} · ${size} · ${file.type || "unknown"}`;
  const source = file.dataUrl || file.previewUrl || "";
  if (/^image\//.test(file.type || "") && source) {
    body.innerHTML = `<img src="${source}" alt="${file.name || "上传素材"}" />`;
  } else if (/^video\//.test(file.type || "") && source) {
    body.innerHTML = `<video src="${source}" controls muted></video>`;
  } else if (/^audio\//.test(file.type || "") && source) {
    body.innerHTML = `<audio src="${source}" controls></audio>`;
  } else {
    body.innerHTML = `
      <div class="upload-preview-placeholder">
        <strong>${file.name || "上传素材"}</strong>
        <span>${file.type || "unknown"} · ${size}</span>
        <p>这个素材可以用于生成，但当前文件类型没有可视预览。</p>
      </div>
    `;
  }
  modal.hidden = false;
}

function removeUploadAsset(id) {
  const removed = state.activeUploads.find((file) => file.id === id);
  if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
  state.activeUploads = state.activeUploads.filter((file) => file.id !== id);
  state.activeUpload = state.activeUploads[state.activeUploads.length - 1] || null;
  updateUploadSummary();
}

function saveSettings() {
  collectSettings();
  collectApiDirectoryKeys();
  Object.entries(imageProviders).forEach(([key, provider]) => {
    const directoryInput = $(`[data-api-key-input="image:${key}"]`);
    if (!directoryInput || !provider.keyField) return;
    const value = directoryInput.value.trim();
    $(`#${provider.keyField}`).value = value;
    if (value) state.settings.keys[key] = value;
    else delete state.settings.keys[key];
  });
  Object.keys(llmProviders).forEach((key) => {
    const directoryInput = $(`[data-api-key-input="llm:${key}"]`);
    if (!directoryInput) return;
    const value = directoryInput.value.trim();
    if (value) state.settings.keys[key] = value;
    else delete state.settings.keys[key];
  });
  const finish = () => {
    persistSettings();
    settingsSavedState.textContent = "已保存";
    settingsSavedState.style.borderColor = "rgba(133, 216, 121, 0.5)";
    settingsSavedState.style.color = "var(--green)";
    updateKeyStatus();
    refreshWorkspaceModels();
    renderApiDirectory();
    toast("后台设置已保存");
  };
  if (settingsModal.classList.contains("admin-scope")) {
    adminRequest("/api/admin/settings", {
      method: "POST",
      body: JSON.stringify({ settings: state.settings }),
    })
      .then((data) => {
        state.settings = { ...state.settings, ...data.settings };
        finish();
      })
      .catch((error) => toast(error.message || "Admin 设置保存失败"));
    return;
  }
  finish();
}

function updateSecurityAccount() {
  const account = state.currentUser || JSON.parse(localStorage.getItem("dreamforge-session") || "null");
  const email = account?.email || "未登录";
  const target = $("#securityAccountEmail");
  if (target) target.textContent = email;
}

function setSettingsScope(scope = "account") {
  const admin = scope === "admin";
  settingsModal.classList.toggle("admin-scope", admin);
  settingsModal.classList.toggle("account-scope", !admin);
  $$(".settings-tab").forEach((tab) => {
    const section = tab.dataset.settingsTab;
    tab.hidden = !admin && section !== "security";
    tab.classList.toggle("active", admin ? section === "keys" : section === "security");
  });
  $$(".settings-section").forEach((section) => {
    const name = section.dataset.settingsSection;
    section.classList.toggle("active", admin ? name === "keys" : name === "security");
  });
  $("#settingsTitle").textContent = admin ? "Admin 后台设置" : "账户设置";
  $(".settings-head .eyebrow").textContent = admin ? "Admin Settings" : "Account";
  $(".settings-head p:last-child").textContent = admin
    ? "配置模型、API Keys、联网生成和账号安全。"
    : "普通用户只能管理账户安全，不显示 API Keys。";
}

function openSettings() {
  loadSettings();
  setSettingsScope("account");
  settingsSavedState.textContent = "未保存";
  settingsSavedState.style.borderColor = "rgba(241, 198, 93, 0.42)";
  settingsSavedState.style.color = "var(--gold)";
  settingsModal.hidden = false;
}

function closeSettings() {
  settingsModal.hidden = true;
}

async function adminRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": adminToken,
      ...(options.headers || {}),
    },
  });
  const data = await readApiJson(response, path);
  if (!response.ok || !data.ok) throw new Error(data.error || "Admin 请求失败");
  return data;
}

function openAdminLogin() {
  adminLoginModal.hidden = false;
  adminPasswordInput.value = "";
  setTimeout(() => adminPasswordInput.focus(), 0);
}

function closeAdminLogin() {
  adminLoginModal.hidden = true;
}

async function loadAdminSettings() {
  const data = await adminRequest("/api/admin/settings");
  state.settings = {
    ...state.settings,
    ...data.settings,
    keys: { ...(state.settings.keys || {}), ...(data.settings.keys || {}) },
    videoApiKeys: { ...(state.settings.videoApiKeys || {}), ...(data.settings.videoApiKeys || {}) },
    videoEndpoints: { ...(state.settings.videoEndpoints || {}), ...(data.settings.videoEndpoints || {}) },
  };
  loadSettings();
  setSettingsScope("admin");
}

async function openAdminSettings() {
  if (!adminToken) {
    openAdminLogin();
    return;
  }
  try {
    await loadAdminSettings();
    settingsModal.hidden = false;
  } catch {
    adminToken = "";
    localStorage.removeItem("dreamforge-admin-token");
    openAdminLogin();
  }
}

async function adminLogin() {
  const password = adminPasswordInput.value.trim();
  if (password.length < 8) {
    toast("Admin 密码至少 8 位");
    return;
  }
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await readApiJson(response, "/api/admin/login");
  if (!response.ok || !data.ok) {
    toast(data.error || "Admin 登录失败");
    return;
  }
  adminToken = data.token;
  localStorage.setItem("dreamforge-admin-token", adminToken);
  closeAdminLogin();
  await openAdminSettings();
  toast(data.firstSetup ? "Admin 密码已创建，后台已开启" : "Admin 后台已开启");
}

async function digestText(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readLocalUsers() {
  return JSON.parse(localStorage.getItem("dreamforge-local-users") || "[]");
}

function writeLocalUsers(users) {
  localStorage.setItem("dreamforge-local-users", JSON.stringify(users));
}

async function localAuthRequest(path, payload = {}) {
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const provider = "email";
  const users = readLocalUsers();

  if (path.endsWith("/register")) {
    const existing = users.find((user) => user.email === email);
    if (existing) throw new Error("这个邮箱已经注册，请直接登录");
    const salt = crypto.randomUUID();
    const user = {
      email,
      name: String(payload.name || "").trim() || email.split("@")[0],
      provider: "email",
      salt,
      passwordHash: await digestText(`${salt}:${password}`),
      verified: true,
      verificationToken: "",
      createdAt: new Date().toISOString(),
    };
    const nextUsers = [...users, user];
    writeLocalUsers(nextUsers);
    return { ok: true, user: { email, name: user.name, provider: "email", verified: true } };
  }

  if (path.endsWith("/login")) {
    const user = users.find((item) => item.email === email);
    if (!user) throw new Error("本机没有找到这个账户，请先注册");
    if (user.provider !== provider) throw new Error(`这个账户是用 ${user.provider} 方式注册的`);
    const passwordHash = await digestText(`${user.salt}:${password}`);
    if (passwordHash !== user.passwordHash) throw new Error("密码不正确");
    return { ok: true, user: { email: user.email, name: user.name, provider: user.provider, verified: true } };
  }

  if (path.endsWith("/resend-verification")) {
    const user = users.find((item) => item.email === email);
    if (!user) throw new Error("本机没有找到这个账户");
    if (user.verified) throw new Error("这个账户已经验证过了");
    user.verificationToken = crypto.randomUUID().replaceAll("-", "");
    writeLocalUsers(users);
    const verificationLink = `${location.origin}${location.pathname}#verify=${user.verificationToken}`;
    localStorage.setItem("dreamforge-last-verification-link", verificationLink);
    return { ok: true, verificationLink };
  }

  if (path.endsWith("/change-password")) {
    const user = users.find((item) => item.email === email);
    const currentPassword = String(payload.currentPassword || "");
    const newPassword = String(payload.newPassword || "");
    if (!user) throw new Error("本机没有找到这个账户");
    const passwordHash = await digestText(`${user.salt}:${currentPassword}`);
    if (passwordHash !== user.passwordHash) throw new Error("当前密码不正确");
    if (newPassword.length < 6) throw new Error("新密码至少 6 位");
    user.salt = crypto.randomUUID();
    user.passwordHash = await digestText(`${user.salt}:${newPassword}`);
    user.updatedAt = new Date().toISOString();
    writeLocalUsers(users);
    return { ok: true };
  }

  if (path.endsWith("/delete-account")) {
    if (payload.confirm !== "DELETE") throw new Error("请输入 DELETE 后再删除账户");
    const nextUsers = users.filter((item) => item.email !== email);
    if (nextUsers.length === users.length) throw new Error("本机没有找到这个账户");
    writeLocalUsers(nextUsers);
    return { ok: true };
  }

  throw new Error("本机认证不支持这个操作");
}

function verifyLocalHashToken() {
  const token = location.hash.startsWith("#verify=") ? location.hash.slice("#verify=".length) : "";
  if (!token) return false;
  const users = readLocalUsers();
  const user = users.find((item) => item.verificationToken === token);
  if (!user) return false;
  user.verified = true;
  user.verificationToken = "";
  writeLocalUsers(users);
  history.replaceState({}, "", location.pathname);
  return true;
}

async function authRequest(path, payload = {}) {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await readApiJson(response, path);
    if (!response.ok || !data.ok) throw new Error(data.error || "认证失败");
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      return localAuthRequest(path, payload);
    }
    throw error;
  }
}

async function readApiJson(response, label = "API") {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const shortText = text.trim().slice(0, 120) || "空响应";
    throw new Error(`${label} 没有返回 JSON：${shortText}。请重启本地后端 npm start 后再试。`);
  }
}

function showVerificationNotice(message, link) {
  verificationNotice.hidden = false;
  verificationNotice.innerHTML = link
    ? `${message}<br><a href="${link}">打开本机验证链接</a>`
    : message;
}

function hideVerificationNotice() {
  verificationNotice.hidden = true;
  verificationNotice.textContent = "";
}

function applyEyeComfort() {
  document.body.classList.toggle("eye-comfort-mode", state.eyeComfort);
  $$(".eye-comfort-control").forEach((button) => {
    button.classList.toggle("active", state.eyeComfort);
    button.textContent = "护眼";
    button.title = state.eyeComfort ? "关闭护眼模式" : "开启护眼模式";
  });
}

function loadEyeComfort() {
  state.eyeComfort = localStorage.getItem("dreamforge-eye-comfort") === "on";
  applyEyeComfort();
}

function toggleEyeComfort() {
  state.eyeComfort = !state.eyeComfort;
  localStorage.setItem("dreamforge-eye-comfort", state.eyeComfort ? "on" : "off");
  applyEyeComfort();
  toast(state.eyeComfort ? "护眼模式已开启：浅色背景" : "护眼模式已关闭：恢复深色背景");
}

function readRememberedLogin() {
  try {
    return JSON.parse(localStorage.getItem("dreamforge-remember-login") || "null");
  } catch {
    return null;
  }
}

function currentLoginInput() {
  return {
    email: $("#emailInput").value.trim(),
    password: $("#passwordInput").value.trim(),
  };
}

function applyRememberedLogin() {
  const remembered = readRememberedLogin();
  rememberPasswordInput.checked = Boolean(remembered?.email && remembered?.password);
  if (remembered?.email) $("#emailInput").value = remembered.email;
  if (remembered?.password) $("#passwordInput").value = remembered.password;
}

function updateRememberedLogin(email, password) {
  if (rememberPasswordInput.checked) {
    if (!email || !password) return;
    localStorage.setItem("dreamforge-remember-login", JSON.stringify({ email, password }));
    return;
  }
  localStorage.removeItem("dreamforge-remember-login");
}

function setAuthMode(mode) {
  state.authMode = mode;
  const isSignup = mode === "signup";
  state.authProvider = "email";
  $("#loginTab").classList.toggle("active", !isSignup);
  $("#signupTab").classList.toggle("active", isSignup);
  authTitle.textContent = isSignup ? "注册 DreamForge" : "登录 DreamForge";
  authSubtitle.textContent = isSignup ? "创建账户后，资料会保存在这台设备。" : "输入这台设备保存过的邮箱和密码。";
  nameField.hidden = !isSignup;
  rememberField.hidden = isSignup;
  if (!isSignup) applyRememberedLogin();
  hideVerificationNotice();
}

function openAuth(mode = "login") {
  setAuthMode(mode);
  authModal.hidden = false;
  $("#emailInput").focus();
}

function closeAuth() {
  authModal.hidden = true;
}

function enterWorkspace() {
  state.isAuthed = true;
  state.currentUser = state.currentUser || JSON.parse(localStorage.getItem("dreamforge-session") || "null");
  closeAuth();
  landing.hidden = true;
  workspace.hidden = false;
  launchStudioWorkspace({ mode: "text", model: "BytePlus Seedance 1.5 Pro", scene: "seedance" });
  renderProjects();
  if (state.projects.length) renderProjectChat();
  toast("已进入 Seedance 影片生成");
}

function showStudioHome(withToast = true) {
  launchStudioWorkspace({ mode: "text", model: "BytePlus Seedance 1.5 Pro", scene: "seedance" });
  if (withToast) toast("已回到 Seedance 影片生成");
}

function requireAuth() {
  if (!state.isAuthed) {
    openAuth("signup");
    toast("先登录或注册后即可开始生成");
    return false;
  }
  return true;
}

function readProjects() {
  try {
    const saved = JSON.parse(localStorage.getItem("dreamforge-projects") || "null");
    return Array.isArray(saved) && saved.length ? saved : state.projects;
  } catch {
    toast("生成记录读取失败，已显示默认项目");
    return state.projects;
  }
}

function saveProjects() {
  if (!state.projectsLoaded) return;
  try {
    localStorage.setItem("dreamforge-projects", JSON.stringify(state.projects.slice(0, 120)));
  } catch {
    toast("本机空间不足，部分生成记录可能无法保存");
  }
}

function projectThumb(project) {
  if (project.imageUrl) {
    return `<span class="project-thumb image"><img src="${project.imageUrl}" alt="" /></span>`;
  }
  if (project.videoUrl) {
    return `<span class="project-thumb video">MP4</span>`;
  }
  if (project.storyboard) {
    return `<span class="project-thumb storyboard">分镜</span>`;
  }
  return `<span class="project-thumb job">${project.taskId ? "JOB" : "AI"}</span>`;
}

function projectScene(project) {
  if (project.scene) return project.scene;
  const model = `${project.rawModel || ""} ${project.model || ""}`.toLowerCase();
  if (project.mode?.includes("文案") || project.model?.includes("Claude") || project.model?.includes("DeepSeek") || project.model?.includes("Qwen")) return "copywriter";
  if (project.storyboard || project.mode === "分镜脚本") return "storyboard";
  if (model.includes("nano-banana") || model.includes("nano banana")) return "nanobanana";
  if (model.includes("gpt-image") || model.includes("openai")) return "image";
  if (model.includes("seedance") || model.includes("byteplus") || model.includes("dreamina")) return "seedance";
  if (model.includes("runway") || project.mode?.includes("电影")) return "cinema";
  if (model.includes("pika") || project.mode?.includes("音频")) return "audio";
  if (model.includes("canvas") || model.includes("gemini-3-pro-image")) return "canvas";
  if (project.mode?.includes("营销")) return "marketing";
  return "";
}

function visibleProjects() {
  const scene = state.currentScene || workspace.dataset.scene || "";
  return state.projects.filter((project) => {
    const matchesScene = !scene || projectScene(project) === scene;
    const matchesFilter = state.filter === "all" || project.favorite;
    return matchesScene && matchesFilter;
  });
}

function renderProjects() {
  const list = visibleProjects();
  projectList.innerHTML = "";
  if (!list.length) {
    projectList.innerHTML = `<div class="empty-history">这个栏目还没有生成记录</div>`;
    saveProjects();
    return;
  }
  list.forEach((project) => {
    const card = document.createElement("div");
    card.className = `project-card${project.id === state.currentProjectId ? " active" : ""}`;
    card.innerHTML = `
      <button class="project-open" data-project-id="${project.id}">
        ${projectThumb(project)}
        <span class="project-info">
          <strong>${project.favorite ? "★ " : ""}${project.title}</strong>
          <small>${project.mode} · ${project.model}</small>
          <small>${project.outputSize || "素材 project"} · ${project.status || "已记录"} · ${project.progress ?? 100}%</small>
          <small>${project.time}</small>
        </span>
      </button>
      <button class="project-delete" data-action="delete-project" data-delete-project-id="${project.id}" title="删除项目">删除</button>
    `;
    projectList.appendChild(card);
  });
  saveProjects();
}

function currentProject() {
  return state.projects.find((item) => item.id === state.currentProjectId);
}

function renderProjectChat() {
  const project = currentProject();
  if (!project) {
    projectChatStatus.textContent = "选择 project 后可以修改";
    projectChatMessages.innerHTML = "<p>生成素材后，这里会记录每次修改要求。</p>";
    projectChatInput.value = "";
    return;
  }
  project.messages = project.messages || [];
  projectChatStatus.textContent = `${project.status || "已记录"} · ${project.progress ?? 100}%`;
  const progress = Math.max(0, Math.min(100, Number(project.progress ?? 100)));
  const statusCard = `
    <article class="project-status-card">
      <strong>${project.title}</strong>
      <span>${project.mode} · ${project.model}</span>
      <div class="project-status-track"><div style="width: ${progress}%"></div></div>
      <small>${project.status || "已记录"} · ${progress}% · ${project.outputSize || "原始尺寸"}</small>
    </article>
  `;
  const messages = project.messages.length
    ? project.messages.map((message) => `
        <article class="project-chat-message ${message.role}">
          <strong>${message.role === "user" ? "你" : "DreamForge"}</strong>
          <p>${message.text}</p>
        </article>
      `).join("")
    : "<p>输入修改要求后，会在这个 project 里留下记录。</p>";
  projectChatMessages.innerHTML = statusCard + messages;
  saveProjects();
}

function updateProjectStatus(project, status, progress = 100) {
  if (!project) return;
  project.status = status;
  project.progress = progress;
  project.updatedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  renderProjects();
  if (state.currentProjectId === project.id) renderProjectChat();
}

function resetWorkspaceDraft() {
  state.currentProjectId = "";
  state.activeUpload = null;
  state.activeUploads = [];
  $("#workspaceTitle").textContent = state.currentMode === "imagegen" ? "新建 AI 图片" : "新建 AI 影片";
  promptInput.value = "";
  updateCount();
  uploadStatus.hidden = true;
  uploadStatus.textContent = "";
  if (uploadTray) {
    uploadTray.hidden = true;
    uploadTray.innerHTML = "";
  }
  const referenceCount = $("#referenceCount");
  if (referenceCount) referenceCount.textContent = "0 张";
  resetPreviewVisual();
  previewStage.className = "preview-stage idle";
  previewTitle.textContent = "等待生成";
  previewMeta.textContent = "选择模型并输入提示词后开始";
  renderProjectChat();
}

function deleteProject(id) {
  const project = state.projects.find((item) => item.id === id);
  if (!project) return;
  const confirmed = window.confirm(`确定删除「${project.title}」吗？`);
  if (!confirmed) {
    toast("已取消删除");
    return;
  }
  state.projects = state.projects.filter((item) => item.id !== id);
  if (state.currentProjectId === id) {
    resetWorkspaceDraft();
  }
  renderProjects();
  toast("项目已删除");
}

function loadProject(id) {
  const project = state.projects.find((item) => item.id === id);
  if (!project) return;
  state.currentProjectId = id;
  const isImageProject = Boolean(project.imageUrl) || project.mode.includes("图片") || project.mode.includes("生图");
  state.currentScene = projectScene(project);
  workspace.dataset.scene = state.currentScene;
  workspace.classList.remove("workspace-home");
  workspace.classList.toggle("image-focus", isImageProject);
  workspace.classList.toggle("generator-focus", !isImageProject);
  setMode(isImageProject ? "imagegen" : "image", { silent: true });
  if (project.storyboard) {
    $("#previewHeading").textContent = "分镜预览";
    generateLabel.textContent = "生成分镜";
  }
  $("#workspaceTitle").textContent = project.title;
  promptInput.value = project.prompt;
  const modelValue = project.rawModel || project.model;
  if (Array.from($("#modelSelect").options).some((option) => option.value === modelValue || option.textContent === modelValue)) {
    $("#modelSelect").value = modelValue;
  }
  updateCount();
  renderProjects();
  if (project.imageUrl) {
    setImagePreview(project.imageUrl, project.title, `${project.mode} · ${project.model}`, project.outputSize);
  } else if (project.videoUrl) {
    setVideoPreview(project.videoUrl, project.title, `${project.mode} · ${project.model}`, project.outputSize);
  } else if (project.storyboard) {
    setStoryboardResult({ shots: project.storyboard });
  } else {
    setPreviewReady(project.title, `${project.mode} · ${project.model}`);
  }
  if (state.currentScene === "copywriter") {
    renderCopywriterChat(project);
  }
  renderProjectChat();
}

function restoreLatestProject() {
  const list = visibleProjects();
  if (!list.length) {
    resetWorkspaceDraft();
    return;
  }
  loadProject(list[0].id);
}

function assetProjects() {
  return state.projects.filter((project) =>
    state.assetFilter === "image" ? Boolean(project.imageUrl) : Boolean(project.videoUrl)
  );
}

function renderAssets() {
  $("[data-asset-filter='image']")?.classList.toggle("active", state.assetFilter === "image");
  $("[data-asset-filter='video']")?.classList.toggle("active", state.assetFilter === "video");
  const items = assetProjects();
  if (!items.length) {
    assetsGrid.innerHTML = `<div class="empty-history">还没有生成过${state.assetFilter === "image" ? "图片" : "影片"}素材</div>`;
    return;
  }
  assetsGrid.innerHTML = items.map((project) => `
    <button class="asset-card" data-asset-project-id="${project.id}">
      <div class="asset-preview">
        ${project.imageUrl
          ? `<img src="${project.imageUrl}" alt="${project.title}" />`
          : `<video src="${project.videoUrl}" muted playsinline></video>`}
      </div>
      <strong>${project.title}</strong>
      <span>${project.model}</span>
      <small>${project.outputSize || "原始尺寸"} · ${project.time}</small>
    </button>
  `).join("");
}

function openAssets() {
  state.assetFilter = "image";
  renderAssets();
  assetsModal.hidden = false;
}

function closeAssets() {
  assetsModal.hidden = true;
}

function addLog(text) {
  state.logs.unshift(text);
  state.logs = state.logs.slice(0, 8);
  if (!renderLog) return;
  renderLog.innerHTML = state.logs.map((log) => `<li>${log}</li>`).join("");
}

function setMode(mode, options = {}) {
  if (mode === "text") mode = "image";
  state.currentMode = mode;
  $$(".mode-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.mode === mode));
  uploadPanel.hidden = mode === "imagegen";
  uploadTitle.textContent = mode === "image" ? "上传参考图片" : "上传参考影片";
  $("#uploadHint").textContent = mode === "image" ? "参考首帧、角色或产品图" : "参考运镜、构图或动作片段";
  $("#workspaceTitle").textContent = mode === "imagegen" ? "新建 AI 图片" : "新建 AI 影片";
  $("#previewHeading").textContent = mode === "imagegen" ? "图片预览" : "影片预览";
  $("#modelLabel").textContent = mode === "imagegen" ? "图片模型" : "模型";
  $("#durationControl").hidden = mode === "imagegen" || state.currentScene === "marketing";
  generateLabel.textContent = state.currentScene === "copywriter" ? "生成文案" : mode === "imagegen" ? "生成图片" : "生成影片";
  marketingPanel.hidden = state.currentScene !== "marketing";
  copywriterPanel.hidden = state.currentScene !== "copywriter";
  populateWorkspaceModels();
  if (!options.silent) toast(
    mode === "image"
        ? "已切换到图片生成影片"
        : "已切换到 AI 生图"
  );
}

function syncSelectedModel(model) {
  if (!model) return;
  populateWorkspaceModels();
  if (![...$("#modelSelect").options].some((option) => option.value === model)) return;
  $("#modelSelect").value = model;
  if (state.currentMode === "imagegen") {
    const providerKey = imageModelProviderMap[model] || state.settings.imageProvider;
    state.settings.imageProvider = providerKey;
    state.settings.imageModel = model;
    $("#imageProviderSetting").value = providerKey;
    populateImageModels();
    $("#imageModelSetting").value = model;
  } else if (isCloudVideoModel(model)) {
    const providerKey = cloudVideoModelMap[model];
    state.settings.videoProvider = providerKey;
    state.settings.videoModel = model;
    $("#videoProviderSetting").value = providerKey;
    populateVideoModels();
    $("#videoModelSetting").value = model;
  } else if (isLocalVideoModel(model)) {
    state.settings.localVideoModel = model;
    $("#localVideoModelSetting").value = model;
  }
}

function launchStudioWorkspace({ mode, model, scene }) {
  state.currentScene = scene || "";
  workspace.dataset.scene = state.currentScene;
  workspace.classList.remove("workspace-home");
  workspace.classList.toggle("image-focus", mode === "imagegen");
  workspace.classList.toggle("generator-focus", mode !== "imagegen");
  setMode(mode || "image", { silent: true });
  syncSelectedModel(model);
  resetWorkspaceDraft();
  updateGeneratorSizeControls();
  const sceneNames = {
    viral: "爆款短视频项目",
    clipper: "影片剪辑再生成",
    seedance: "Seedance 影片生成",
    copywriter: "AI 对话工作台",
    image: "AI 图片生成",
    nanobanana: "Nano Banana 生图",
    marketing: "营销广告项目",
    storyboard: "分镜脚本",
    local: "本地 Wan 2.2 影片",
    canvas: "AI Canvas 图片",
    cinema: "电影感影片项目",
    audio: "音频驱动影片",
  };
  const placeholders = {
    viral: "例如：年轻创作者在城市街头展示新品，快节奏剪辑，强钩子开场，适合短视频平台，明亮商业质感",
    clipper: "上传一段参考影片后，描述你想保留的动作、镜头节奏和新画面风格",
    seedance: "例如：高级时装模特穿过白色棚拍空间，镜头环绕，布料自然飘动，广告级灯光",
    copywriter: "直接输入你的问题或要求，也可以上传图片/文件作为参考。系统会使用你选择的模型和对应 API Key 联网回复。",
    image: "例如：一张高端香水广告海报，玻璃瓶、黑曜石台面、金色边缘光、超写实产品摄影",
    nanobanana: "例如：一张真实感旅行海报，年轻人在吉隆坡街头，明亮自然光，丰富细节，社交媒体封面构图",
    marketing: "写入你的营销文案、故事或广告要求。系统会直接把提示词和参考图交给 Seedance 生成影片。",
    storyboard: "写入广告、短片或剧情文案，例如：一位年轻创业者在雨夜便利店完成产品灵感，从低落到重新出发，结尾出现品牌口号。",
    local: "例如：本地 Wan 2.2 生成雨夜霓虹街头，人物自然行走，镜头低角度跟拍，真实运动模糊",
    canvas: "例如：社交媒体主视觉，未来感 AI 创意工作室，清晰主体，大面积留白，适合排版",
    cinema: "例如：史诗电影开场，荒漠中的巨大黑色方碑，广角镜头，风沙，低沉光线，慢速推进",
    audio: "上传一段音乐、旁白或参考影片后，描述你想要的节奏、镜头和视觉风格",
  };
  const heroTitles = {
    seedance: "SEEDANCE 1.5 PRO",
    copywriter: "COPYWRITER LLM",
    image: "GPT IMAGE 2",
    nanobanana: "NANO BANANA",
    marketing: "MARKETING STUDIO",
    storyboard: "STORYBOARD SCRIPT",
    local: "LOCAL WAN 2.2",
    canvas: "DREAMFORGE CANVAS",
    cinema: "CINEMA STUDIO",
    audio: "AUDIO REACTIVE VIDEO",
  };
  const heroSubtitles = {
    seedance: "Describe a scene, character, mood, or style — and generate an AI video",
    copywriter: "Choose your language model and generate ad copy or voiceover scripts",
    image: "Describe the image you imagine — and generate it with GPT Image 2",
    nanobanana: "Describe the image you imagine — powered by Google Gemini API",
    marketing: "Prompt + references → Seedance REST video",
    storyboard: "Copywriting → ChatGPT optimization → storyboard panels",
    local: "Use your local Wan 2.2 model for video generation",
    canvas: "Start with a visual idea and build a polished image",
    cinema: "Create cinematic shots with mood, lens, lighting, and motion",
    audio: "Upload sound or video, then generate visuals that follow its rhythm",
  };
  $("#workspaceTitle").textContent = sceneNames[scene] || "新建 AI 项目";
  $("#generatorHeroKicker").textContent = "START CREATING WITH";
  $("#generatorHeroTitle").textContent = heroTitles[scene] || ($("#modelSelect").value || "AI MODEL").toUpperCase();
  $("#generatorHeroSubtitle").textContent = heroSubtitles[scene] || "Describe a scene, character, mood, or style — and watch it come to life";
  promptInput.placeholder = placeholders[scene] || promptInput.placeholder;
  if (scene === "storyboard") {
    $("#previewHeading").textContent = "分镜预览";
    generateLabel.textContent = "生成分镜";
  }
  if (scene === "seedance") {
    uploadPanel.hidden = false;
    uploadTitle.textContent = "上传参考图片或素材";
    $("#uploadHint").textContent = "可选。用于 Image to Video 或参考构图、角色、动作";
    $("#durationControl").hidden = false;
  }
  if (scene === "marketing") {
    marketingPanel.hidden = false;
    $("#previewHeading").textContent = "营销预览";
    generateLabel.textContent = "自动生成";
    $("#durationControl").hidden = true;
    state.marketingStage = "copy";
    state.marketingStoryboard = [];
    renderMarketingStoryboardGrid();
    setMarketingStage("copy");
    uploadPanel.hidden = false;
    uploadTitle.textContent = "上传参考图片或素材";
    $("#uploadHint").textContent = "可选。系统会结合文案判断生成图片或影片";
    loadMarketingNews();
  }
  if (scene === "copywriter") {
    copywriterPanel.hidden = false;
    $("#previewHeading").textContent = "文案预览";
    $("#modelLabel").textContent = "大语言模型";
    generateLabel.textContent = "生成文案";
    renderCopywriterChat(null);
    setTimeout(() => copyChatInput.focus(), 0);
  }
  if (scene === "audio") {
    uploadTitle.textContent = "上传音频或参考影片";
    $("#uploadHint").textContent = "支持 MP3、WAV、MP4，用节奏驱动画面";
  }
  if (scene === "clipper") {
    uploadTitle.textContent = "上传参考影片";
    $("#uploadHint").textContent = "参考片段、节奏、构图或动作";
  }
  previewMeta.textContent = "选择素材、模型并输入提示词后开始";
  resetPreviewVisual();
  if (mode === "imagegen") {
    previewStage.className = "preview-stage idle";
    previewTitle.textContent = "等待生成图片";
    previewMeta.textContent = "输入提示词后点击 Generate，右侧会显示实时进度";
  }
  renderProjects();
  toast(`已进入：${sceneNames[scene] || "生成窗口"} · ${$("#modelSelect").value}`);
}

function filterStudioHome(filter) {
  $("[data-studio-filter].active")?.classList.remove("active");
  const active = $(`[data-studio-filter="${filter}"]`);
  if (active) active.classList.add("active");
  const query = $("#studioSearch").value.trim().toLowerCase();
  $$(".tool-card, .feature-card").forEach((card) => {
    const kind = card.dataset.toolKind || "";
    const text = card.textContent.toLowerCase();
    const matchesKind = filter === "all" || kind === filter || (filter === "video" && kind === "cinema");
    const matchesQuery = !query || text.includes(query);
    card.hidden = !(matchesKind && matchesQuery);
  });
  toast(filter === "all" ? "显示全部工作场景" : `已筛选 ${active?.textContent.trim() || filter}`);
}

function readUploads() {
  try {
    return JSON.parse(localStorage.getItem("dreamforge-uploads") || "[]");
  } catch {
    return [];
  }
}

function saveUploads() {
  localStorage.setItem("dreamforge-uploads", JSON.stringify(state.uploads.slice(0, 80)));
}

function uploadKind(file) {
  if (file.type.startsWith("audio/")) return "音频";
  if (file.type.startsWith("video/")) return "影片素材";
  if (file.type.startsWith("image/")) return "图片素材";
  return "上传内容";
}

function renderStudioSearchResults(rawQuery = "") {
  const panel = $("#studioSearchResults");
  if (!panel) return;
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    state.searchResults = [];
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }

  const projectResults = state.projects
    .filter((project) => [project.title, project.mode, project.model, project.prompt].join(" ").toLowerCase().includes(query))
    .map((project) => ({
      type: "project",
      title: project.title,
      meta: `${project.mode} · ${project.model}`,
      id: project.id,
    }));
  const uploadResults = state.uploads
    .filter((item) => [item.name, item.kind, item.mode, item.projectTitle].join(" ").toLowerCase().includes(query))
    .map((item) => ({
      type: "upload",
      title: item.name,
      meta: `${item.kind} · ${item.mode || "素材库"} · ${item.createdAt}`,
      id: item.id,
    }));
  const toolResults = $$(".tool-card, .feature-card")
    .filter((card) => card.textContent.toLowerCase().includes(query) || (card.dataset.toolKind || "").includes(query))
    .map((card, index) => ({
      type: "tool",
      title: card.querySelector("strong")?.textContent || "工作场景",
      meta: card.querySelector("p")?.textContent || "模型入口",
      launch: {
        mode: card.dataset.mode,
        model: card.dataset.model,
        scene: card.dataset.scene,
      },
      id: `tool-${index}`,
    }));

  state.searchResults = [...projectResults, ...uploadResults, ...toolResults].slice(0, 10);
  panel.hidden = false;
  panel.innerHTML = `
    <div class="search-results-head">
      <strong>搜索结果</strong>
      <span>${state.searchResults.length ? `找到 ${state.searchResults.length} 个匹配` : "没有找到匹配内容"}</span>
    </div>
    <div class="search-results-list">
      ${state.searchResults.map((item, index) => `
        <button type="button" data-search-result="${index}">
          <span>${item.type === "project" ? "Project" : item.type === "upload" ? "Asset" : "Tool"}</span>
          <strong>${item.title}</strong>
          <small>${item.meta}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function openSearchResult(index) {
  const item = state.searchResults[Number(index)];
  if (!item) return;
  if (item.type === "project") {
    loadProject(item.id);
    toast(`已打开项目：${item.title}`);
    return;
  }
  if (item.type === "tool") {
    launchStudioWorkspace(item.launch);
    return;
  }
  toast(`已找到素材：${item.title}`);
}

function updateCount() {
  charCount.textContent = `${promptInput.value.length} / 900`;
}

function setPreviewReady(title, meta) {
  if (!$(".preview-visual .play-core")) resetPreviewVisual();
  previewStage.className = "preview-stage ready";
  previewStage.style.removeProperty("--output-ratio");
  previewStage.style.removeProperty("--output-aspect");
  previewTitle.textContent = title;
  previewMeta.textContent = meta;
  $("#progressRing").textContent = "HD";
}

function setImagePreview(imageUrl, title, meta, outputSize = getSelectedPixelSize()) {
  previewStage.className = "preview-stage ready image-ready";
  const [width, height] = outputSize.split("x").map(Number);
  if (width && height) {
    previewStage.style.setProperty("--output-ratio", `${width} / ${height}`);
    previewStage.style.setProperty("--output-aspect", String(width / height));
  }
  $(".preview-visual").innerHTML = `<img class="generated-image" src="${imageUrl}" alt="${title}" /><div id="progressRing" class="progress-ring">PNG</div>`;
  previewTitle.textContent = title;
  previewMeta.textContent = `${meta} · ${outputSize} · 完整比例预览 · 原始尺寸下载`;
}

function stopProgressTimer() {
  if (state.progressTimer) {
    clearInterval(state.progressTimer);
    state.progressTimer = null;
  }
}

function selectedVideoDurationLabel() {
  const select = $("#durationSelect");
  if (!select) return "未选择";
  if (select.value === "auto-reference") return "根据提示词和参考图自动决定";
  return select.selectedOptions?.[0]?.textContent.trim() || select.value;
}

function formatVideoDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return selectedVideoDurationLabel();
  const rounded = Math.round(value);
  const minutes = Math.floor(rounded / 60);
  const rest = rounded % 60;
  return minutes ? `${minutes}分${String(rest).padStart(2, "0")}秒` : `${rest}秒`;
}

function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showPauseGeneration() {
  state.generationAbortRequested = false;
  if (!pauseGenerationBtn) return;
  pauseGenerationBtn.hidden = false;
  pauseGenerationBtn.disabled = false;
  pauseGenerationBtn.textContent = "暂停生成";
}

function hidePauseGeneration() {
  if (!pauseGenerationBtn) return;
  pauseGenerationBtn.hidden = true;
  pauseGenerationBtn.disabled = false;
  pauseGenerationBtn.textContent = "暂停生成";
  state.activeAbortController = null;
}

function requestPauseGeneration() {
  if (!state.isGenerating) return;
  state.generationAbortRequested = true;
  if (state.activeAbortController) state.activeAbortController.abort();
  if (pauseGenerationBtn) {
    pauseGenerationBtn.disabled = true;
    pauseGenerationBtn.textContent = "正在暂停";
  }
  previewMeta.textContent = "正在停止后续片段提交，已提交的云端任务不会撤回";
  toast("已请求暂停生成");
}

function ensureGenerationNotPaused() {
  if (state.generationAbortRequested) throw new Error("用户已暂停生成");
}

function isPauseError(error) {
  return String(error?.message || "").includes("用户已暂停生成");
}

async function pausableFetch(url, options = {}) {
  ensureGenerationNotPaused();
  const controller = new AbortController();
  state.activeAbortController = controller;
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") throw new Error("用户已暂停生成");
    throw error;
  } finally {
    if (state.activeAbortController === controller) state.activeAbortController = null;
  }
}

async function waitForSeedanceVideo(taskId, apiKey, endpoint, project, label = "Seedance") {
  if (!taskId) throw new Error("Seedance 没有返回任务 ID，无法查询影片结果");
  const maxAttempts = 75;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    ensureGenerationNotPaused();
    await waitFor(attempt === 0 ? 3500 : 8000);
    ensureGenerationNotPaused();
    const progress = Math.min(98, 28 + Math.round((attempt / maxAttempts) * 68));
    setVideoProgress(progress, `${label} 正在生成影片`);
    previewMeta.textContent = `TaskId: ${taskId} · 正在等待云端生成完成`;
    if (project) updateProjectStatus(project, "生成中", progress);
    const response = await pausableFetch("/api/query-byteplus-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, endpoint, taskId }),
    });
    const data = await readApiJson(response, response.url || "API");
    if (!response.ok || !data.ok) throw new Error(data.error || "Seedance 查询任务失败");
    if (data.videoUrl) return data;
    if (data.status && /fail|error|cancel|expire|reject/.test(data.status)) {
      throw new Error(`Seedance 任务失败：${data.status}`);
    }
  }
  throw new Error("Seedance 生成还没完成，请稍后用 TaskId 到后台查询");
}

function setImageProgress(percent, label = "正在生成图片") {
  previewStage.className = "preview-stage generating";
  $(".preview-visual").innerHTML = `
    <div class="image-progress" style="--progress: ${percent}%">
      <strong>${percent}%</strong>
      <div class="image-progress-track"><div class="image-progress-fill"></div></div>
      <span>${label}</span>
    </div>
    <div id="progressRing" class="progress-ring">${percent}%</div>
  `;
  previewTitle.textContent = label;
  previewMeta.textContent = `${imageProviders[state.settings.imageProvider].label} · ${state.settings.imageModel} · ${getSelectedPixelSize()}`;
}

function startImageProgress() {
  stopProgressTimer();
  let progress = 8;
  setImageProgress(progress, "正在连接生图 API");
  state.progressTimer = setInterval(() => {
    progress = Math.min(92, progress + Math.floor(Math.random() * 9) + 3);
    const label = progress < 32 ? "正在理解提示词" : progress < 70 ? "正在生成画面" : "正在精修细节";
    setImageProgress(progress, label);
  }, 620);
}

function renderPreviewVideoStatusCard(percent, label) {
  const progress = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
  const model = $("#modelSelect").value;
  const duration = selectedVideoDurationLabel();
  const outputSize = getSelectedSizeLabel();
  return `
    <article class="project-status-card preview-status-progress">
      <strong>${label}</strong>
      <span>${model} · ${outputSize}</span>
      <div class="project-status-track"><div style="width: ${progress}%"></div></div>
      <small>影片时长：${duration} · 生成中 · ${progress}%</small>
    </article>
    <div id="progressRing" class="progress-ring">${progress}%</div>
  `;
}

function setVideoProgress(percent, label = "正在生成影片") {
  previewStage.className = "preview-stage generating real-progress";
  $(".preview-visual").innerHTML = renderPreviewVideoStatusCard(percent, label);
  previewTitle.textContent = label;
  previewMeta.textContent = `${$("#modelSelect").value} · 影片时长：${selectedVideoDurationLabel()} · ${getSelectedSizeLabel()}`;
}

function setWorkflowProgress(percent, label, detail = "") {
  previewStage.className = "preview-stage generating";
  $(".preview-visual").innerHTML = `
    <div class="image-progress marketing-progress" style="--progress: ${percent}%">
      <strong>${percent}%</strong>
      <div class="image-progress-track"><div class="image-progress-fill"></div></div>
      <span>${label}</span>
      ${detail ? `<small>${detail}</small>` : ""}
    </div>
    <div id="progressRing" class="progress-ring">${percent}%</div>
  `;
  previewTitle.textContent = label;
  previewMeta.textContent = detail || "Marketing workflow 正在后台运行";
}

function setMarketingWorkflowResult(data) {
  previewStage.className = "preview-stage ready";
  const storyboard = data.storyboard || [];
  const tasks = data.tasks || [];
  const hasFailedTasks = Number(data.failedCount || 0) > 0;
  $(".preview-visual").innerHTML = `
    <div class="marketing-result">
      <strong>${hasFailedTasks ? "Marketing Workflow 部分完成" : "Marketing Workflow 完成"}</strong>
      <p>${data.optimizedCopy || "文案已优化"}</p>
      <div class="storyboard-list">
        ${storyboard.map((shot, index) => `
          <span>${index + 1}. ${shot.title || "分镜"} · ${shot.duration || "3秒"}</span>
        `).join("")}
      </div>
      <div class="storyboard-list">
        ${tasks.map((task) => `
          <span>${task.status === "failed" ? "失败" : "已提交"} · 分镜 ${task.shot}: ${task.message || task.taskId || "任务已记录"}</span>
        `).join("")}
      </div>
    </div>
    <div id="progressRing" class="progress-ring">DONE</div>
  `;
  previewTitle.textContent = hasFailedTasks ? "营销影片工作流部分完成" : "营销影片工作流已完成";
  previewMeta.textContent = `${storyboard.length} 个分镜 · 成功 ${data.submittedCount || 0} · 失败 ${data.failedCount || 0}`;
}

function setMarketingStage(stage) {
  state.marketingStage = stage;
  $$("[data-marketing-step]").forEach((item) => item.classList.toggle("active", item.dataset.marketingStep === stage));
  $$("[data-marketing-view]").forEach((item) => {
    item.hidden = item.dataset.marketingView !== stage;
  });
  const nextButton = $('[data-action="marketing-next-step"]');
  const backButton = $('[data-action="marketing-back-step"]');
  if (backButton) backButton.hidden = stage === "copy";
  if (nextButton) {
    nextButton.textContent = stage === "copy" ? "自动生成" : stage === "storyboard" ? "生成影片" : "重新生成影片";
  }
  if (stage === "video") setMarketingVideoPreview();
}

function renderMarketingStoryboardGrid() {
  const host = $("#marketingStoryboardGrid");
  if (!host) return;
  const shots = state.marketingStoryboard || [];
  $("#marketingStoryboardCount").textContent = `${shots.length} 个动作`;
  host.innerHTML = shots.map((shot, index) => `
    <article class="marketing-story-card">
      <div class="storyboard-thumb">
        ${shot.imageUrl ? `<img src="${shot.imageUrl}" alt="${shot.title || `分镜 ${index + 1}`}" />` : ""}
        <span>${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="storyboard-copy">
        <strong>镜头 ${index + 1} · ${shot.title || "分镜"}</strong>
        <p>${shot.action || shot.visual || ""}</p>
        ${shot.dialogue ? `<small>${shot.dialogue}</small>` : ""}
      </div>
    </article>
  `).join("");
}

function storyboardPanelImagePrompt(shot, index) {
  return `${shot.imagePrompt || shot.visual || shot.action || promptInput.value.trim()}

Storyboard panel ${index + 1}.
Action: ${shot.action || shot.visual || ""}
Dialogue or voiceover context: ${shot.dialogue || "none"}
Style: cinematic storyboard frame, production reference for cinematographer, clear composition, realistic lighting, no text, no subtitle, no watermark.`;
}

function marketingVideoPrompt() {
  const copy = promptInput.value.trim();
  const size = getSelectedPixelSize();
  return `请根据以下分镜图和动作顺序生成一支营销广告影片。
输出尺寸：${size}
用户原始文案：${copy}

分镜顺序：
${(state.marketingStoryboard || []).map((shot, index) => `${index + 1}. 动作：${shot.action || shot.visual || shot.title || ""}
对白/旁白：${shot.dialogue || "无"}
画面：${shot.visual || shot.imagePrompt || ""}
镜头：${shot.camera || "自然镜头"}`).join("\n\n")}

要求：严格按照分镜顺序生成，不要新增剧情，保持广告节奏清晰，人物动作和产品信息明确。`;
}

function shotDurationSeconds(shot) {
  const direct = Number(shot?.durationSeconds || 0);
  if (direct > 0) return direct;
  const match = String(shot?.duration || "").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 8;
}

function splitShotsIntoVideoSegments(shots = [], maxSeconds = 15) {
  const segments = [];
  shots.forEach((shot, shotIndex) => {
    const totalSeconds = Math.max(1, Math.ceil(shotDurationSeconds(shot)));
    const count = Math.max(1, Math.ceil(totalSeconds / maxSeconds));
    for (let part = 0; part < count; part += 1) {
      const seconds = part === count - 1 ? Math.max(1, totalSeconds - maxSeconds * part) : maxSeconds;
      segments.push({
        shot,
        shotIndex,
        part,
        partCount: count,
        seconds,
      });
    }
  });
  return segments;
}

function marketingVideoSegments(maxSeconds = 12) {
  return splitShotsIntoVideoSegments(state.marketingStoryboard || [], maxSeconds);
}

function marketingSegmentPrompt(segment) {
  const { shot, shotIndex, part, partCount, seconds } = segment;
  const continuity = partCount > 1 ? `这是分镜 ${shotIndex + 1} 的第 ${part + 1}/${partCount} 个连续片段。` : "";
  return `请根据以下分镜生成一个 ${seconds} 秒的营销广告影片片段。
${continuity}
整支影片必须按照分镜顺序连续生成，不要新增剧情。

原始文案：
${promptInput.value.trim()}

当前分镜 ${shotIndex + 1}：
动作：${shot.action || shot.visual || shot.title || ""}
对白/旁白：${shot.dialogue || "无"}
画面：${shot.visual || shot.imagePrompt || ""}
镜头：${shot.camera || "自然镜头"}
参考分镜图：${shot.imageUrl ? "已生成，将作为视觉参考" : "无"}

输出要求：保持人物、产品、光线、风格和上一段连续，画面清晰，适合广告成片。`;
}

function directSegmentPrompt(segment, originalPrompt) {
  const { shot, shotIndex, part, partCount, seconds } = segment;
  const continuity = partCount > 1 ? `这是第 ${shotIndex + 1} 个内容段落的第 ${part + 1}/${partCount} 个连续片段。` : "";
  return `请根据以下文案内容生成一个 ${seconds} 秒的影片片段。
${continuity}
整支影片会由多个片段连续组成，请严格衔接上下文，不要压缩故事，不要新增用户没有给的剧情。

完整文案：
${originalPrompt}

当前片段：
动作：${shot.action || shot.visual || shot.title || ""}
对白/旁白：${shot.dialogue || "无"}
画面：${shot.visual || shot.imagePrompt || ""}
镜头：${shot.camera || "自然镜头"}

输出要求：保持角色、场景、产品信息和情绪连续，广告或故事节奏自然，画面清晰。`;
}

function fallbackShotsFromPrompt(prompt) {
  const chunks = String(prompt || "")
    .split(/(?<=[。！？.!?\n])/)
    .map((item) => item.trim())
    .filter(Boolean);
  const parts = chunks.length ? chunks : [prompt];
  return parts.map((text, index) => ({
    title: `段落 ${index + 1}`,
    action: text,
    visual: text,
    dialogue: text.length <= 80 ? text : "",
    camera: "根据内容自然推进",
    duration: `${Math.min(15, Math.max(4, Math.ceil(text.length / 12)))} 秒`,
    durationSeconds: Math.min(15, Math.max(4, Math.ceil(text.length / 12))),
  }));
}

async function buildAutoDurationSegments(prompt, maxSeconds = 12) {
  return splitShotsIntoVideoSegments(fallbackShotsFromPrompt(prompt), maxSeconds);
}

function videoApiKeyForProvider(providerKey) {
  if (providerKey === "byteplus") return state.settings.keys.byteplus || state.settings.videoApiKeys.byteplus || "";
  return state.settings.videoApiKeys[providerKey] || "";
}

function marketingVideoAttemptQueue() {
  const attempts = [];
  const addAttempt = (providerKey, model) => {
    const provider = videoProviders[providerKey];
    const apiKey = videoApiKeyForProvider(providerKey);
    if (!provider || attempts.some((item) => item.providerKey === providerKey && item.model === model)) return;
    attempts.push({ providerKey, provider, apiKey, model: model || provider.models[0] });
  };
  addAttempt("byteplus", "BytePlus Seedance 1.5 Pro");
  Object.entries(videoProviders).forEach(([providerKey, provider]) => {
    if (providerKey === "byteplus") return;
    addAttempt(providerKey, provider.models[0]);
  });
  return attempts;
}

async function submitMarketingVideoSegment(segment, attempt) {
  const common = {
    apiKey: attempt.apiKey,
    model: byteplusVideoModelIds[attempt.model] || attempt.model,
    modelLabel: attempt.model,
    prompt: marketingSegmentPrompt(segment),
    negativePrompt: negativeInput.value.trim(),
    duration: `${segment.seconds} 秒`,
    ratio: getSelectedAspectRatio(),
    size: getSelectedPixelSize(),
    quality: $("#qualitySelect").value,
    mode: "storyboard-to-video-segment",
  };
  const route = attempt.providerKey === "byteplus" ? "/api/generate-byteplus-video" : "/api/generate-cloud-video";
  const body = attempt.providerKey === "byteplus"
    ? {
        ...common,
        endpoint: state.settings.videoEndpoints?.byteplus || state.settings.byteplusEndpoint || attempt.provider.endpoint,
        workspaceId: state.settings.byteplusWorkspaceId,
        webhook: state.settings.webhook,
      }
    : {
        ...common,
        provider: attempt.providerKey,
        providerLabel: attempt.provider.label,
        endpoint: state.settings.videoEndpoints?.[attempt.providerKey]
          || (attempt.providerKey === state.settings.videoProvider ? state.settings.videoEndpoint : "")
          || attempt.provider.endpoint,
      };
  const response = await pausableFetch(route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await readApiJson(response, response.url || "API");
  if (!response.ok || !data.ok) throw new Error(data.error || `${attempt.provider.label} 片段生成失败`);
  return data;
}

function directVideoFallbackQueue(skipProviders = []) {
  return marketingVideoAttemptQueue().filter((attempt) => !skipProviders.includes(attempt.providerKey));
}

async function submitDirectVideoAttempt(prompt, attempt) {
  const common = {
    apiKey: attempt.apiKey,
    model: byteplusVideoModelIds[attempt.model] || attempt.model,
    modelLabel: attempt.model,
    prompt,
    negativePrompt: negativeInput.value.trim(),
    duration: attempt.duration || $("#durationSelect").value,
    ratio: getSelectedAspectRatio(),
    size: getSelectedPixelSize(),
    quality: $("#qualitySelect").value,
    mode: state.currentMode,
  };
  const route = attempt.providerKey === "byteplus" ? "/api/generate-byteplus-video" : "/api/generate-cloud-video";
  const body = attempt.providerKey === "byteplus"
    ? {
        ...common,
        endpoint: state.settings.videoEndpoints?.byteplus || state.settings.byteplusEndpoint || attempt.provider.endpoint,
        workspaceId: state.settings.byteplusWorkspaceId,
        webhook: state.settings.webhook,
      }
    : {
        ...common,
        provider: attempt.providerKey,
        providerLabel: attempt.provider.label,
        endpoint: state.settings.videoEndpoints?.[attempt.providerKey]
          || (attempt.providerKey === state.settings.videoProvider ? state.settings.videoEndpoint : "")
          || attempt.provider.endpoint,
      };
  const response = await pausableFetch(route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await readApiJson(response, response.url || "API");
  if (!response.ok || !data.ok) throw new Error(data.error || `${attempt.provider.label} 影片生成失败`);
  return data;
}

async function tryDirectVideoFallback(prompt, skipProviders = []) {
  const attempts = directVideoFallbackQueue(skipProviders);
  const errors = [];
  for (const attempt of attempts) {
    ensureGenerationNotPaused();
    try {
      setVideoProgress(72, `正在尝试 ${attempt.provider.label}`);
      const data = await submitDirectVideoAttempt(prompt, attempt);
      const project = createProjectFromPrompt();
      project.model = attempt.model;
      project.rawModel = attempt.model;
      project.outputSize = getSelectedPixelSize();
      project.taskId = data.taskId || "";
      if (data.videoUrl) {
        project.videoUrl = data.videoUrl;
        updateProjectStatus(project, "影片已生成", 100);
        setVideoPreview(data.videoUrl, project.title, `已由 ${attempt.provider.label} 生成 · ${attempt.model}`, project.outputSize);
      } else {
        updateProjectStatus(project, data.pending ? "任务生成中" : "任务已提交", 100);
        previewStage.className = "preview-stage ready";
        previewTitle.textContent = `${attempt.provider.label} 任务已提交`;
        previewMeta.textContent = data.message || data.taskId || "云端服务正在后台生成影片";
        $("#progressRing").textContent = "JOB";
      }
      addLog(`${project.title} 已切换到 ${attempt.provider.label} · ${attempt.model}`);
      return true;
    } catch (error) {
      if (isPauseError(error)) throw error;
      errors.push(`${attempt.provider.label}: ${error.message}`);
    }
  }
  if (errors.length) previewMeta.textContent = errors.join("；");
  return false;
}

async function generateAutoDurationSeedanceVideo(prompt, byteplusKey) {
  setVideoProgress(18, "正在按文案拆分影片时长");
  const segments = await buildAutoDurationSegments(prompt, 12);
  const attempts = [{
    providerKey: "byteplus",
    provider: videoProviders.byteplus,
    apiKey: byteplusKey,
    model: $("#modelSelect").value,
  }];
  const tasks = [];
  for (let index = 0; index < segments.length; index += 1) {
    ensureGenerationNotPaused();
    const segment = segments[index];
    let data = null;
    let usedAttempt = null;
    const errors = [];
    for (const attempt of attempts) {
      ensureGenerationNotPaused();
      try {
        setVideoProgress(
          Math.min(96, 20 + Math.round(((index + 1) / segments.length) * 72)),
          `自动时长片段 ${index + 1}/${segments.length} · ${attempt.provider.label}`
        );
        const promptForSegment = directSegmentPrompt(segment, prompt);
        data = await submitDirectVideoAttempt(promptForSegment, {
          ...attempt,
          model: attempt.providerKey === "byteplus" ? $("#modelSelect").value : attempt.model,
          duration: `${segment.seconds} 秒`,
        });
        usedAttempt = attempt;
        break;
      } catch (error) {
        if (isPauseError(error)) throw error;
        errors.push(`${attempt.provider.label}: ${error.message}`);
      }
    }
    if (!data || !usedAttempt) throw new Error(`片段 ${index + 1} Seedance REST API 失败：${errors.join("；")}`);
    const endpoint = state.settings.videoEndpoints?.byteplus || state.settings.byteplusEndpoint;
    const finalData = data.videoUrl
      ? data
      : await waitForSeedanceVideo(data.taskId, byteplusKey, endpoint, null, `Seedance 片段 ${index + 1}/${segments.length}`);
    tasks.push({
      segment: index + 1,
      shot: segment.shotIndex + 1,
      part: segment.part + 1,
      partCount: segment.partCount,
      seconds: segment.seconds,
      provider: usedAttempt.provider.label,
      model: usedAttempt.model,
      taskId: data.taskId || "",
      message: data.message || `${usedAttempt.provider.label} 任务已提交`,
      videoUrl: finalData.videoUrl || "",
    });
  }
  const project = createProjectFromPrompt();
  project.model = [...new Set(tasks.map((task) => task.model))].join(" / ");
  project.rawModel = $("#modelSelect").value;
  project.outputSize = getSelectedPixelSize();
  project.videoTasks = tasks;
  project.taskId = tasks.map((task) => task.taskId).filter(Boolean).join(", ");
  project.videoUrl = tasks.find((task) => task.videoUrl)?.videoUrl || "";
  updateProjectStatus(project, project.videoUrl ? "影片已生成" : `${tasks.length} 个自动时长片段已完成`, 100);
  if (project.videoUrl) {
    setVideoPreview(project.videoUrl, project.title, `Seedance 自动时长 · 第 1 个片段预览`, project.outputSize);
  } else {
    previewStage.className = "preview-stage ready";
    previewTitle.textContent = "Seedance 自动时长片段已完成";
    previewMeta.textContent = `${tasks.length} 个片段 · 总时长约 ${tasks.reduce((sum, task) => sum + Number(task.seconds || 0), 0)} 秒 · ${getSelectedPixelSize()}`;
    $("#progressRing").textContent = "MP4";
  }
  addLog(`${project.title} Seedance 自动时长片段已生成`);
  return true;
}

function detectMarketingIntent() {
  const text = `${promptInput.value} ${uploadStatus.textContent || ""}`.toLowerCase();
  const imageWords = ["图片", "生图", "海报", "封面", "视觉", "banner", "poster", "image", "photo", "thumbnail", "主视觉", "平面"];
  const videoWords = ["影片", "视频", "短片", "广告片", "口播", "分镜", "storyboard", "video", "reels", "tiktok", "shorts", "拍摄", "镜头"];
  const imageScore = imageWords.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
  const videoScore = videoWords.reduce((score, word) => score + (text.includes(word) ? 1 : 0), 0);
  if (imageScore > videoScore) return "image";
  return "video";
}

function marketingImagePrompt() {
  const reference = uploadStatus.textContent ? `\n参考素材：${uploadStatus.textContent.replace(/^已上传\s*/, "")}` : "";
  return `${promptInput.value.trim()}${reference}

请根据以上营销文案和参考素材生成广告图片。
要求：适合社媒投放，主体明确，商业质感，构图干净，文字不要直接画进图里，保留可后期排版空间。`;
}

async function generateMarketingAutoImage() {
  const prompt = promptInput.value.trim();
  if (prompt.length < 8) {
    promptInput.focus();
    toast("请先写入图片需求或营销文案");
    return;
  }
  collectSettings();
  collectApiDirectoryKeys();
  const apiKey = state.settings.keys.openai;
  state.isGenerating = true;
  state.settings.imageProvider = "openai";
  state.settings.imageModel = "gpt-image-2";
  const nextButton = $('[data-action="marketing-next-step"]');
  if (nextButton) {
    nextButton.disabled = true;
    nextButton.textContent = "生图中";
  }
  startImageProgress("GPT Image 2 正在生成营销图片");
  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: marketingImagePrompt(),
        provider: "openai",
        model: "gpt-image-2",
        apiKey,
        size: getSelectedPixelSize(),
        sizeMode: $("#ratioSelect").value === "custom" ? "custom" : "preset",
        quality: state.settings.imageQuality || "auto",
        safeMode: isSafeModeEnabled(),
      }),
    });
    const data = await readApiJson(response, response.url || "API");
    if (!response.ok || !data.ok) throw new Error(data.error || "营销图片生成失败");
    stopProgressTimer();
    const project = createProjectFromPrompt();
    project.mode = "Marketing Studio 图片";
    project.model = "OpenAI · GPT Image 2";
    project.rawModel = "gpt-image-2";
    project.imageUrl = data.imageUrl;
    project.outputSize = getSelectedPixelSize();
    updateProjectStatus(project, "图片已生成", 100);
    setImagePreview(data.imageUrl, project.title, "Marketing Studio · GPT Image 2", project.outputSize);
  } catch (error) {
    stopProgressTimer();
    previewStage.className = "preview-stage idle";
    previewTitle.textContent = "营销图片生成失败";
    previewMeta.textContent = error.message;
    toast(`营销图片生成失败：${error.message}`);
  } finally {
    state.isGenerating = false;
    if (nextButton) {
      nextButton.disabled = false;
      nextButton.textContent = "自动生成";
    }
  }
}

function setMarketingVideoPreview(videoUrl = "") {
  const shots = state.marketingStoryboard || [];
  previewStage.className = "preview-stage ready marketing-video-ready";
  $(".preview-visual").innerHTML = `
    <div class="marketing-video-layout">
      <aside class="marketing-video-shots">
        ${shots.map((shot, index) => `
          <article>
            ${shot.imageUrl ? `<img src="${shot.imageUrl}" alt="${shot.title || `分镜 ${index + 1}`}" />` : `<span>${index + 1}</span>`}
            <div>
              <strong>${index + 1}. ${shot.action || shot.title || "动作"}</strong>
              <small>${shot.dialogue || shot.visual || ""}</small>
            </div>
          </article>
        `).join("")}
      </aside>
      <section class="marketing-video-preview-frame">
        <div class="marketing-video-output" style="--marketing-output-ratio: ${getSelectedAspectRatio().replace(":", " / ")}">
          ${videoUrl ? `<video src="${videoUrl}" controls muted loop></video>` : `<div class="marketing-video-placeholder">等待影片生成</div>`}
        </div>
      </section>
    </div>
    <div id="progressRing" class="progress-ring">${videoUrl ? "MP4" : "VIDEO"}</div>
  `;
  previewTitle.textContent = videoUrl ? "营销影片已生成" : "营销影片预览";
  previewMeta.textContent = `${shots.length} 个分镜 · 预览框 1920×1080 · 成片 ${getSelectedPixelSize()} 完整 fit`;
}

async function generateMarketingStoryboardPanels() {
  const copy = promptInput.value.trim();
  if (copy.length < 8) {
    promptInput.focus();
    toast("请先写入营销文案或故事");
    return;
  }
  collectSettings();
  collectApiDirectoryKeys();
  state.isGenerating = true;
  showPauseGeneration();
  const nextButton = $('[data-action="marketing-next-step"]');
  if (nextButton) {
    nextButton.disabled = true;
    nextButton.textContent = "生成中";
  }
  setWorkflowProgress(20, "正在拆解文案动作", "OpenAI 正在严格按照原文分段");
  try {
    const scriptResponse = await pausableFetch("/api/storyboard-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        copy,
        model: "Marketing Studio",
        size: getSelectedPixelSize(),
        maxShots: 240,
        maxShotSeconds: 12,
        openaiKey: state.settings.keys.openai,
      }),
    });
    const scriptData = await readApiJson(scriptResponse, scriptResponse.url || "API");
    if (!scriptResponse.ok || !scriptData.ok) throw new Error(scriptData.error || "分镜拆解失败");
    state.marketingStoryboard = scriptData.shots || [];
    renderMarketingStoryboardGrid();
    setStoryboardResult({ shots: state.marketingStoryboard });
    for (let index = 0; index < state.marketingStoryboard.length; index += 1) {
      ensureGenerationNotPaused();
      setWorkflowProgress(
        Math.min(96, Math.round(((index + 1) / state.marketingStoryboard.length) * 90)),
        `正在生成分镜图 ${index + 1}/${state.marketingStoryboard.length}`,
        "GPT Image 2 正在逐格生成，已生成的会先显示"
      );
      const imageResponse = await pausableFetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: storyboardPanelImagePrompt(state.marketingStoryboard[index], index),
          provider: "openai",
          model: "gpt-image-2",
          apiKey: state.settings.keys.openai,
          size: getSelectedPixelSize(),
          sizeMode: $("#ratioSelect").value === "custom" ? "custom" : "preset",
          quality: state.settings.imageQuality || "medium",
          safeMode: isSafeModeEnabled(),
        }),
      });
      const imageData = await readApiJson(imageResponse, imageResponse.url || "API");
      if (!imageResponse.ok || !imageData.ok) throw new Error(imageData.error || `分镜图 ${index + 1} 生成失败`);
      state.marketingStoryboard[index].imageUrl = imageData.imageUrl;
      renderMarketingStoryboardGrid();
      setStoryboardResult({ shots: state.marketingStoryboard });
    }
    renderMarketingStoryboardGrid();
    setStoryboardResult({ shots: state.marketingStoryboard });
    setMarketingStage("storyboard");
  } catch (error) {
    previewStage.className = "preview-stage idle";
    previewTitle.textContent = "分镜图生成失败";
    previewMeta.textContent = error.message;
    toast(`分镜图生成失败：${error.message}`);
  } finally {
    state.isGenerating = false;
    hidePauseGeneration();
    if (nextButton) nextButton.disabled = false;
  }
}

async function generateMarketingStoryboardVideo() {
  if (!(state.marketingStoryboard || []).length) {
    setMarketingStage("copy");
    return;
  }
  setMarketingStage("video");
  collectSettings();
  collectApiDirectoryKeys();
  const useSeedanceRestOnly = state.settings.videoProvider === "byteplus" || isBytePlusVideoModel(state.settings.videoModel);
  const byteplusKey = state.settings.keys.byteplus || state.settings.videoApiKeys.byteplus || "";
  const attempts = useSeedanceRestOnly
    ? [{
        providerKey: "byteplus",
        provider: videoProviders.byteplus,
        apiKey: byteplusKey,
        model: state.settings.videoModel || "BytePlus Seedance 1.5 Pro",
      }]
    : marketingVideoAttemptQueue();
  if (!attempts.length) {
    toast("后台还没有可用的影片服务商设置");
    return;
  }
  const nextButton = $('[data-action="marketing-next-step"]');
  if (nextButton) {
    nextButton.disabled = true;
    nextButton.textContent = "生成中";
  }
  state.isGenerating = true;
  showPauseGeneration();
  startVideoProgress("正在把分镜提交给影片模型");
  try {
    const segments = marketingVideoSegments(12);
    const tasks = [];
    for (let index = 0; index < segments.length; index += 1) {
      ensureGenerationNotPaused();
      const segment = segments[index];
      let data = null;
      let usedAttempt = null;
      const errors = [];
      for (const attempt of attempts) {
        ensureGenerationNotPaused();
        try {
          setVideoProgress(
            Math.min(94, Math.round(((index + 1) / segments.length) * 92)),
            `片段 ${index + 1}/${segments.length} · ${attempt.provider.label}`
          );
          data = await submitMarketingVideoSegment(segment, attempt);
          usedAttempt = attempt;
          break;
        } catch (error) {
          if (isPauseError(error)) throw error;
          errors.push(`${attempt.provider.label}: ${error.message}`);
        }
      }
      if (!data || !usedAttempt) throw new Error(useSeedanceRestOnly
        ? `片段 ${index + 1} Seedance REST API 失败：${errors.join("；")}`
        : `片段 ${index + 1} 所有影片模型都失败：${errors.join("；")}`);
      tasks.push({
        segment: index + 1,
        shot: segment.shotIndex + 1,
        part: segment.part + 1,
        partCount: segment.partCount,
        seconds: segment.seconds,
        provider: usedAttempt.provider.label,
        model: usedAttempt.model,
        taskId: data.taskId || "",
        message: data.message || `${usedAttempt.provider.label} 任务已提交`,
        videoUrl: data.videoUrl || "",
      });
    }
    stopProgressTimer();
    const firstVideoUrl = tasks.find((task) => task.videoUrl)?.videoUrl || "";
    setMarketingVideoPreview(firstVideoUrl);
    const project = createProjectFromPrompt();
    project.mode = "Marketing Studio 影片";
    project.model = [...new Set(tasks.map((task) => task.model))].join(" / ");
    project.storyboard = state.marketingStoryboard;
    project.videoUrl = firstVideoUrl;
    project.videoTasks = tasks;
    project.taskId = tasks.map((task) => task.taskId).filter(Boolean).join(", ");
    project.outputSize = getSelectedPixelSize();
    updateProjectStatus(project, firstVideoUrl ? "影片已生成" : `${tasks.length} 个片段任务已提交`, 100);
    previewMeta.textContent = `${tasks.length} 个影片片段 · 每段最长 15 秒 · 成片 ${getSelectedPixelSize()} 完整覆盖故事`;
  } catch (error) {
    stopProgressTimer();
    setMarketingVideoPreview("");
    previewTitle.textContent = "影片生成失败";
    previewMeta.textContent = error.message;
    toast(`影片生成失败：${error.message}`);
  } finally {
    state.isGenerating = false;
    hidePauseGeneration();
    if (nextButton) {
      nextButton.disabled = false;
      nextButton.textContent = "重新生成影片";
    }
  }
}

function marketingContext() {
  const news = Array.from(marketingNewsList.querySelectorAll("[data-news-title]"))
    .slice(0, 5)
    .map((item) => item.dataset.newsTitle)
    .join("；");
  return {
    audience: marketingAudience?.value?.trim?.() || "",
    goal: marketingGoal?.value || "提升转化",
    channel: marketingChannel?.value || "TikTok / Reels / Shorts",
    news,
  };
}

function marketingPrompt(kind = "video") {
  const context = marketingContext();
  return `${promptInput.value.trim()}

营销目标：${context.goal}
目标受众：${context.audience || "未指定，按大众消费者处理"}
投放渠道：${context.channel}
今日马来西亚新闻参考：${context.news || "无"}
输出类型：${kind === "image" ? "广告图片/社媒视觉" : "营销广告影片"}
要求：文案必须针对受众痛点，画面要有明确购买动机、品牌记忆点和行动号召。`;
}

function selectedCopyLlm() {
  const [provider, model] = copyLlmSelect.value.split(":");
  const labels = {
    ...Object.fromEntries(Object.entries(llmProviders).map(([key, provider]) => [key, provider.label])),
  };
  return { provider, model, label: labels[provider] || provider };
}

function copyLlmKey(provider) {
  const keyMap = {
    openai: "openai",
    google: "google",
    anthropic: "anthropic",
    deepseek: "deepseek",
    qwen: "qwen",
    xai: "xai",
    openrouter: "openrouter",
    mistral: "mistral",
    cohere: "cohere",
    perplexity: "perplexity",
    moonshot: "moonshot",
    zhipu: "zhipu",
    groq: "groq",
    together: "together",
    fireworks: "fireworks",
    nvidia: "nvidia",
    cerebras: "cerebras",
    sambanova: "sambanova",
    ai21: "ai21",
    baidu: "baidu",
    minimax: "minimax",
    yi: "yi",
  };
  return state.settings.keys[keyMap[provider]] || "";
}

function renderCopyAttachments() {
  if (!copyAttachmentTray) return;
  copyAttachmentTray.hidden = state.copyAttachments.length === 0;
  copyAttachmentTray.innerHTML = state.copyAttachments.map((file) => `
    <span class="copy-attachment-chip">
      <span>${file.kind === "image" ? "图片" : "文件"} · ${file.name}</span>
      <button type="button" data-action="copy-remove-reference" data-attachment-id="${file.id}" aria-label="移除">×</button>
    </span>
  `).join("");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("文件读取失败"));
    reader.readAsDataURL(file);
  });
}

function dataUrlByteSize(dataUrl) {
  const base64 = String(dataUrl || "").split(",")[1] || "";
  return Math.ceil((base64.length * 3) / 4);
}

const SEEDANCE_MAX_IMAGE_PIXELS = 36_000_000;
const SEEDANCE_MAX_IMAGE_BYTES = 20_000_000;
const SEEDANCE_MAX_IMAGE_DATA_URL_CHARS = 24_000_000;

async function compressImageForSeedance(file) {
  const original = await readFileAsDataUrl(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("参考图片读取失败"));
    img.src = original;
  });
  const originalWidth = image.naturalWidth || image.width;
  const originalHeight = image.naturalHeight || image.height;
  const originalPixels = originalWidth * originalHeight;
  const originalBytes = dataUrlByteSize(original);
  if (
    originalPixels < SEEDANCE_MAX_IMAGE_PIXELS
    && originalBytes <= SEEDANCE_MAX_IMAGE_BYTES
    && original.length <= SEEDANCE_MAX_IMAGE_DATA_URL_CHARS
  ) {
    return original;
  }
  const pixelScale = originalPixels >= SEEDANCE_MAX_IMAGE_PIXELS
    ? Math.sqrt((SEEDANCE_MAX_IMAGE_PIXELS - 1) / originalPixels)
    : 1;
  let width = Math.max(1, Math.round(originalWidth * pixelScale));
  let height = Math.max(1, Math.round(originalHeight * pixelScale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  let quality = 0.92;
  let compressed = "";
  for (let attempt = 0; attempt < 10; attempt += 1) {
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    compressed = canvas.toDataURL("image/jpeg", quality);
    if (dataUrlByteSize(compressed) <= SEEDANCE_MAX_IMAGE_BYTES && compressed.length <= SEEDANCE_MAX_IMAGE_DATA_URL_CHARS) break;
    if (quality > 0.62) {
      quality -= 0.1;
    } else {
      width = Math.max(1, Math.round(width * 0.86));
      height = Math.max(1, Math.round(height * 0.86));
    }
  }
  return compressed;
}

function readFileAsText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve("");
    reader.readAsText(file);
  });
}

function isReadableTextFile(file) {
  return /^text\//.test(file.type || "") || /\.(txt|md|csv|json|log|srt|vtt)$/i.test(file.name || "");
}

async function addCopyReferenceFiles(files) {
  const nextFiles = Array.from(files || []).slice(0, 6 - state.copyAttachments.length);
  if (!nextFiles.length) return;
  const attachments = await Promise.all(nextFiles.map(async (file) => {
    const isImage = /^image\//.test(file.type || "");
    return {
      id: `a${Date.now()}${Math.random().toString(16).slice(2)}`,
      name: file.name,
      type: file.type || "application/octet-stream",
      kind: isImage ? "image" : "file",
      size: file.size,
      dataUrl: isImage ? await readFileAsDataUrl(file) : "",
      text: isReadableTextFile(file) ? (await readFileAsText(file)).slice(0, 12000) : "",
    };
  }));
  state.copyAttachments.push(...attachments);
  renderCopyAttachments();
  if (copyAttachmentInput) copyAttachmentInput.value = "";
}

function appendCopyChat(role, text, title = "") {
  const article = document.createElement("article");
  article.className = role;
  article.innerHTML = `<strong>${title || (role === "user" ? "你" : "DreamForge AI")}</strong><p>${text}</p>`;
  copyChatWindow.appendChild(article);
  copyChatWindow.scrollTop = copyChatWindow.scrollHeight;
}

function renderCopywriterChat(project = currentProject()) {
  copyChatWindow.innerHTML = "";
  const messages = project?.messages?.length
    ? project.messages
    : [{ role: "assistant", text: "选择模型后直接提问，也可以上传图片或文件作为参考。我会通过对应 API 联网思考并回复。" }];
  messages.forEach((message) => {
    appendCopyChat(message.role === "user" ? "user" : "assistant", message.text, message.role === "user" ? "你" : "DreamForge AI");
  });
}

function startNewCopyChat() {
  state.currentProjectId = "";
  promptInput.value = "";
  copyChatInput.value = "";
  state.copyAttachments = [];
  renderCopyAttachments();
  updateCount();
  renderCopywriterChat(null);
  renderProjects();
}

async function generateCopyChat() {
  if (!requireAuth() || state.isGenerating) return;
  const prompt = copyChatInput.value.trim();
  if (!prompt) {
    copyChatInput.focus();
    return;
  }
  collectSettings();
  collectApiDirectoryKeys();
  const llm = selectedCopyLlm();
  const apiKey = copyLlmKey(llm.provider);
  state.isGenerating = true;
  const sendButton = $(".copy-send");
  if (sendButton) sendButton.disabled = true;
  const attachments = [...state.copyAttachments];
  let activeProject = currentProject();
  if (activeProject?.scene !== "copywriter") {
    activeProject = {
      id: `p${Date.now()}`,
      title: prompt.slice(0, 18) || "新 AI 对话",
      scene: "copywriter",
      mode: "AI 对话",
      model: `${llm.label} · ${llm.model}`,
      time: "刚刚",
      favorite: false,
      prompt,
      outputSize: "文案",
      status: "对话中",
      progress: 30,
      messages: [],
    };
    state.projects.unshift(activeProject);
    state.currentProjectId = activeProject.id;
  }
  activeProject.messages = activeProject.messages || [];
  const attachmentNote = attachments.length ? `\n\n参考附件：${attachments.map((item) => item.name).join("、")}` : "";
  activeProject.messages.push({ role: "user", text: `${prompt}${attachmentNote}`, time: new Date().toLocaleString("zh-CN", { hour12: false }) });
  renderProjects();
  renderCopywriterChat(activeProject);
  copyChatInput.value = "";
  state.copyAttachments = [];
  renderCopyAttachments();
  appendCopyChat("assistant", "正在思考...", `${llm.label} · ${llm.model}`);
  const pendingMessage = copyChatWindow.lastElementChild;
  const historyForRequest = activeProject.messages.slice(0, -1);
  try {
    const response = await fetch("/api/generate-copy-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: llm.provider,
        providerLabel: llm.label,
        model: llm.model,
        apiKey,
        copyType: "自动判断",
        tone: "根据用户自然语言要求判断",
        prompt,
        history: historyForRequest,
        attachments,
      }),
    });
    const data = await readApiJson(response, response.url || "API");
    if (!response.ok || !data.ok) throw new Error(data.error || "AI 回复失败");
    const text = data.text || "模型没有返回回复";
    if (pendingMessage) pendingMessage.remove();
    appendCopyChat("assistant", text, `${llm.label} · ${llm.model}`);
    promptInput.value = text;
    updateCount();
    const project = activeProject;
    project.title = project.title || prompt.slice(0, 12);
    project.prompt = text;
    project.mode = "AI 对话";
    project.model = `${llm.label} · ${llm.model}`;
    project.scene = "copywriter";
    project.status = "回复已生成";
    project.progress = 100;
    project.messages = project.messages || [{ role: "user", text: prompt, time: new Date().toLocaleString("zh-CN", { hour12: false }) }];
    project.messages.push({ role: "assistant", text, time: new Date().toLocaleString("zh-CN", { hour12: false }) });
    state.currentProjectId = project.id;
    updateProjectStatus(project, "回复已生成", 100);
  } catch (error) {
    if (pendingMessage) pendingMessage.remove();
    appendCopyChat("assistant", `AI 回复失败：${error.message}`, "DreamForge AI");
    toast(`AI 回复失败：${error.message}`);
  } finally {
    state.isGenerating = false;
    if (sendButton) sendButton.disabled = false;
  }
}

async function loadMarketingNews() {
  marketingNewsList.textContent = "正在更新马来西亚最新 10 条新闻...";
  try {
    const response = await fetch(`/api/marketing-news?country=MY&limit=10&refresh=${Date.now()}`);
    const data = await readApiJson(response, response.url || "资讯 API");
    const items = data.items || [];
    marketingNewsList.innerHTML = items.length
      ? items.slice(0, 10).map((item) => `
          <button type="button" data-news-title="${item.title}" data-action="marketing-use-news">
            <strong>${item.title}</strong>
            <span>${item.source || "Malaysia"} · ${item.published || "Today"}</span>
          </button>
        `).join("")
      : "暂时没有可用的马来西亚新闻。";
  } catch (error) {
    marketingNewsList.textContent = error.message || "资讯更新失败";
  }
}

async function checkMarketingCopy() {
  const copy = promptInput.value.trim();
  if (!copy || !state.settings.keys.openai) {
    if (!state.settings.keys.openai) openSettings();
    return;
  }
  const context = marketingContext();
  previewStage.className = "preview-stage generating";
  previewTitle.textContent = "正在检查受众匹配";
  previewMeta.textContent = `${context.audience || "目标受众未填写"} · ${context.channel}`;
  try {
    const response = await fetch("/api/marketing-copy-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        copy,
        openaiKey: state.settings.keys.openai,
        ...context,
      }),
    });
    const data = await readApiJson(response, response.url || "受众检查");
    if (!response.ok || !data.ok) throw new Error(data.error || "受众检查失败");
    previewStage.className = "preview-stage ready";
    $(".preview-visual").innerHTML = `
      <div class="marketing-result">
        <strong>受众检查完成</strong>
        <p>${data.summary || "已完成分析"}</p>
        <div class="storyboard-list">
          ${(data.suggestions || []).map((item) => `<span>${item}</span>`).join("")}
        </div>
      </div>
      <div id="progressRing" class="progress-ring">${data.score || 0}%</div>
    `;
    previewTitle.textContent = `受众匹配度 ${data.score || 0}%`;
    previewMeta.textContent = context.audience || "未指定受众";
  } catch (error) {
    previewTitle.textContent = "受众检查失败";
    previewMeta.textContent = error.message;
  }
}

async function generateMarketingImage() {
  const originalMode = state.currentMode;
  const originalPrompt = promptInput.value;
  state.currentMode = "imagegen";
  populateWorkspaceModels();
  $("#modelSelect").value = state.settings.imageModel || $("#modelSelect").value;
  promptInput.value = marketingPrompt("image");
  updateCount();
  await generateImage();
  state.currentMode = originalMode;
  promptInput.value = originalPrompt;
  updateCount();
}

async function generateMarketingVideo() {
  generateVideo();
}

function setStoryboardResult(data) {
  const shots = data.shots || [];
  const columns = shots.length <= 2 ? shots.length || 1 : shots.length <= 4 ? 2 : shots.length <= 9 ? 3 : 4;
  const sheetClass = state.currentScene === "marketing" ? "storyboard-sheet" : "";
  previewStage.className = "preview-stage ready storyboard-ready";
  $(".preview-visual").innerHTML = `
    <div class="storyboard-result ${sheetClass}" style="--storyboard-columns: ${columns}">
      ${shots.map((shot, index) => `
        <article class="storyboard-panel ${shot.imageUrl ? "has-image" : ""}">
          <div class="storyboard-thumb">
            ${shot.imageUrl ? `<img src="${shot.imageUrl}" alt="${shot.title || `分镜 ${index + 1}`}" />` : ""}
            <span>${String(index + 1).padStart(2, "0")}</span>
          </div>
          <div class="storyboard-copy">
            <strong>镜头 ${index + 1} · ${shot.title || "分镜"}</strong>
            <p>${shot.action || shot.visual || shot.imagePrompt || ""}</p>
            ${shot.dialogue ? `<p>${shot.dialogue}</p>` : ""}
            <small>${shot.duration || "3秒"} · ${shot.camera || "镜头自然推进"}</small>
          </div>
        </article>
      `).join("")}
    </div>
    <div id="progressRing" class="progress-ring">SCRIPT</div>
  `;
  previewTitle.textContent = shots.some((shot) => shot.imageUrl) ? "分镜图已生成" : "分镜脚本已生成";
  previewMeta.textContent = `${shots.length} 个动作分镜 · GPT Image 2 · ${getSelectedSizeLabel()}`;
}

async function generateStoryboardScript() {
  if (!requireAuth() || state.isGenerating) return;
  const copy = promptInput.value.trim();
  if (copy.length < 8) {
    promptInput.focus();
    return;
  }
  collectSettings();
  collectApiDirectoryKeys();
  if (!state.settings.keys.openai) {
    openSettings();
    return;
  }
  state.isGenerating = true;
  generateBtn.disabled = true;
  generateLabel.textContent = "生成中";
  setWorkflowProgress(18, "正在读取文案", "准备生成分镜脚本");
  try {
    const response = await fetch("/api/storyboard-panels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        copy,
        model: $("#modelSelect").value,
        size: getSelectedPixelSize(),
        quality: state.settings.imageQuality || "medium",
        imageModel: "gpt-image-2",
        maxShots: 120,
        maxShotSeconds: 12,
        openaiKey: state.settings.keys.openai,
      }),
    });
    const data = await readApiJson(response, response.url || "API");
    if (!response.ok || !data.ok) throw new Error(data.error || "分镜图生成失败");
    promptInput.value = data.optimizedCopy || copy;
    updateCount();
    const project = createProjectFromPrompt();
    project.mode = "分镜图";
    project.model = "OpenAI · GPT Image 2";
    project.rawModel = "gpt-image-2";
    project.outputSize = getSelectedPixelSize();
    project.storyboard = data.shots || [];
    project.messages = [
      { role: "user", text: copy, time: new Date().toLocaleString("zh-CN", { hour12: false }) },
      { role: "assistant", text: `已根据原文生成 ${project.storyboard.length} 个动作分镜图。`, time: new Date().toLocaleString("zh-CN", { hour12: false }) },
    ];
    updateProjectStatus(project, "已完成", 100);
    setStoryboardResult(data);
    addLog(`${project.title} 分镜脚本已生成`);
  } catch (error) {
    previewStage.className = "preview-stage idle";
    previewTitle.textContent = "分镜脚本生成失败";
    previewMeta.textContent = error.message;
    $("#progressRing").textContent = "!";
  } finally {
    state.isGenerating = false;
    generateBtn.disabled = false;
    generateLabel.textContent = "生成分镜";
  }
}

function startVideoProgress(label = "正在创建影片任务") {
  stopProgressTimer();
  let progress = 6;
  setVideoProgress(progress, label);
  state.progressTimer = setInterval(() => {
    progress = Math.min(94, progress + Math.floor(Math.random() * 8) + 4);
    const step = progress < 30 ? "正在理解镜头与动作" : progress < 68 ? "正在生成关键帧与运动" : "正在合成影片任务";
    setVideoProgress(progress, step);
  }, 680);
}

function setVideoPreview(videoUrl, title, meta, outputSize = getSelectedPixelSize()) {
  previewStage.className = "preview-stage ready video-ready";
  const [width, height] = outputSize.split("x").map(Number);
  let fitClass = "is-wide";
  if (width && height) {
    previewStage.style.setProperty("--output-ratio", `${width} / ${height}`);
    previewStage.style.setProperty("--output-aspect", String(width / height));
    fitClass = width / height < 16 / 9 ? "is-tall" : "is-wide";
  }
  $(".preview-visual").innerHTML = `
    <div class="video-output-frame ${fitClass}">
      <video class="generated-video" src="${videoUrl}" controls muted loop></video>
    </div>
    <div id="progressRing" class="progress-ring">MP4</div>
  `;
  previewTitle.textContent = title;
  const initialDuration = selectedVideoDurationLabel();
  previewMeta.textContent = `${meta} · 影片时长：${initialDuration} · ${outputSize} · 完整比例预览 · 原始尺寸下载`;
  const video = $(".generated-video");
  video?.addEventListener("loadedmetadata", () => {
    previewMeta.textContent = `${meta} · 影片时长：${formatVideoDuration(video.duration)} · ${outputSize} · 完整比例预览 · 原始尺寸下载`;
  }, { once: true });
}

function resetPreviewVisual() {
  $(".preview-visual").innerHTML = `<span class="play-core">▶</span><div id="progressRing" class="progress-ring">0%</div>`;
}

function createProjectFromPrompt() {
  const prompt = promptInput.value.trim();
  const title = prompt ? prompt.slice(0, 12) : "未命名影片";
  const modeLabel = $(".mode-tab.active").textContent;
  const parent = currentProject();
  const baseMessages = parent?.pendingModification
    ? [
        ...(parent.messages || []),
        { role: "assistant", text: "已根据这条修改要求生成新的素材 project。", time: new Date().toLocaleString("zh-CN", { hour12: false }) },
      ]
    : [];
  const project = {
    id: `p${Date.now()}`,
    title,
    scene: state.currentScene || workspace.dataset.scene || "",
    mode: modeLabel,
    model: $("#modelSelect").value,
    time: "刚刚",
    favorite: false,
    prompt: prompt || "一段电影感 AI 影片",
    outputSize: getSelectedPixelSize(),
    sourceProjectId: parent?.pendingModification ? parent.id : "",
    status: parent?.pendingModification ? "修改生成中" : "生成中",
    progress: 0,
    messages: baseMessages,
  };
  if (parent) delete parent.pendingModification;
  state.projects.unshift(project);
  state.currentProjectId = project.id;
  renderProjects();
  renderProjectChat();
  return project;
}

function sendProjectModification() {
  const project = currentProject();
  const instruction = projectChatInput.value.trim();
  if (!project) {
    toast("请先选择一个 project");
    return;
  }
  if (instruction.length < 4) {
    toast("请写下你要怎么修改这个素材");
    projectChatInput.focus();
    return;
  }
  project.messages = project.messages || [];
  project.messages.push({
    role: "user",
    text: instruction,
    time: new Date().toLocaleString("zh-CN", { hour12: false }),
  });
  project.pendingModification = instruction;
  const basePrompt = project.prompt || promptInput.value.trim();
  if (project.outputSize) {
    const matchingOption = Array.from($("#ratioSelect").options).some((option) => option.value === project.outputSize);
    if (matchingOption) {
      $("#ratioSelect").value = project.outputSize;
    } else {
      const [width, height] = project.outputSize.split("x").map(Number);
      if (width && height) {
        $("#ratioSelect").value = "custom";
        $("#generatorCustomWidth").value = width;
        $("#generatorCustomHeight").value = height;
      }
    }
    updateGeneratorSizeControls();
  }
  promptInput.value = `${basePrompt}\n\n基于当前 project 修改：${instruction}\n保持输出尺寸：${project.outputSize || getSelectedPixelSize()}。`;
  updateCount();
  projectChatInput.value = "";
  renderProjectChat();
  toast("修改要求已记录，开始生成新的 project");
  generateCurrent();
}

async function generateImage() {
  if (!requireAuth() || state.isGenerating) return;
  const prompt = promptInput.value.trim();
  if (prompt.length < 8) {
    toast("生图提示词再写具体一点，至少 8 个字");
    promptInput.focus();
    return;
  }

  collectSettings();
  collectApiDirectoryKeys();
  const provider = imageModelProviderMap[$("#modelSelect").value] || state.settings.imageProvider;
  state.settings.imageProvider = provider;
  state.settings.imageModel = $("#modelSelect").value;
  const key = state.settings.keys[provider];

  state.isGenerating = true;
  generateBtn.disabled = true;
  generateLabel.textContent = "生图中";
  resetPreviewVisual();
  const pixelSize = getSelectedPixelSize();
  startImageProgress();

  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        negativePrompt: negativeInput.value.trim(),
        provider,
        model: state.settings.imageModel,
        apiKey: key,
        size: pixelSize,
        sizeMode: $("#ratioSelect").value === "custom" ? "custom" : "preset",
        customSize: {
          width: Number(pixelSize.split("x")[0]),
          height: Number(pixelSize.split("x")[1]),
          unit: "px",
        },
        quality: state.settings.imageQuality,
        safeMode: isSafeModeEnabled(),
      }),
    });
    const data = await readApiJson(response, response.url || "API");
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "图片生成失败");
    }
    if (data.pending) {
      const project = createProjectFromPrompt();
      project.mode = "AI 生图";
      project.model = `${imageProviders[provider].label} · ${state.settings.imageModel}`;
      project.rawModel = state.settings.imageModel;
      project.outputSize = pixelSize;
      updateProjectStatus(project, "任务已提交", 100);
      stopProgressTimer();
      setImageProgress(100, "图片任务已提交");
      previewStage.className = "preview-stage ready";
      previewTitle.textContent = "任务已提交";
      previewMeta.textContent = data.message || "服务商正在后台生成图片";
      $("#progressRing").textContent = "JOB";
      addLog(data.message || "图片任务已提交");
      toast("图片任务已提交，请稍后在服务商后台查看");
      return;
    }
    const project = createProjectFromPrompt();
    project.mode = "AI 生图";
    project.model = `${imageProviders[provider].label} · ${state.settings.imageModel}`;
    project.rawModel = state.settings.imageModel;
    project.imageUrl = data.imageUrl;
    project.outputSize = pixelSize;
    updateProjectStatus(project, "已完成", 100);
    stopProgressTimer();
    setImageProgress(100, "图片生成完成");
    setImagePreview(data.imageUrl, project.title, `已生成 · ${project.model}`, project.outputSize);
    addLog(`${project.title} 图片已联网生成`);
    toast("图片已联网生成");
  } catch (error) {
    stopProgressTimer();
    previewStage.className = "preview-stage idle";
    previewTitle.textContent = "图片生成失败";
    previewMeta.textContent = error.message;
    $("#progressRing").textContent = "!";
    toast(`生图失败：${error.message}`);
  } finally {
    stopProgressTimer();
    state.isGenerating = false;
    generateBtn.disabled = false;
    generateLabel.textContent = "生成图片";
  }
}

async function generateLocalVideo(prompt) {
  collectSettings();
  const endpoint = state.settings.localVideoEndpoint;
  if (!endpoint) {
    openSettings();
    toast("请先在后台填写本地影片服务地址");
    state.isGenerating = false;
    return false;
  }

  generateBtn.disabled = true;
  generateLabel.textContent = "本地生成中";
  resetPreviewVisual();
  startVideoProgress("正在调用本地影片模型");

  try {
    const response = await fetch("/api/generate-local-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint,
        token: state.settings.localVideoToken,
        method: state.settings.localVideoMethod,
        model: $("#modelSelect").value,
        modelDirectory: state.settings.localVideoDirectory,
        modelPath: state.settings.localVideoPath,
        textWorkflow: state.settings.localTextWorkflow,
        imageWorkflow: state.currentMode === "image" ? state.settings.localImageWorkflow : "",
        mode: state.currentMode,
        prompt,
        negativePrompt: negativeInput.value.trim(),
        duration: $("#durationSelect").value,
        ratio: getSelectedAspectRatio(),
        size: getSelectedPixelSize(),
        quality: $("#qualitySelect").value,
        seed: "",
        motion: "",
        safeMode: isSafeModeEnabled(),
      }),
    });
    const data = await readApiJson(response, response.url || "API");
    if (!response.ok || !data.ok) throw new Error(data.error || "本地影片生成失败");

    const project = createProjectFromPrompt();
    project.model = $("#modelSelect").value;
    project.rawModel = $("#modelSelect").value;
    project.outputSize = getSelectedPixelSize();
    if (data.videoUrl) {
      project.videoUrl = data.videoUrl;
      updateProjectStatus(project, "已完成", 100);
      stopProgressTimer();
      setVideoProgress(100, "影片生成完成");
      setVideoPreview(data.videoUrl, project.title, `已由本地模型生成 · ${project.model}`, project.outputSize);
    } else if (data.pending) {
      updateProjectStatus(project, "任务已提交", 100);
      stopProgressTimer();
      setVideoProgress(100, "本地任务已提交");
      previewStage.className = "preview-stage ready";
      previewTitle.textContent = "本地任务已提交";
      previewMeta.textContent = data.message || "本地服务正在后台生成影片";
      $("#progressRing").textContent = "JOB";
    } else {
      updateProjectStatus(project, "已完成", 100);
      stopProgressTimer();
      setVideoProgress(100, "影片生成完成");
      setPreviewReady(project.title, `已由本地模型生成 · ${project.model}`);
    }
    addLog(`${project.title} 本地影片任务已提交`);
    toast(data.pending ? "本地影片任务已提交" : "本地影片生成完成");
    return true;
  } catch (error) {
    stopProgressTimer();
    previewStage.className = "preview-stage idle";
    previewTitle.textContent = "本地影片生成失败";
    previewMeta.textContent = error.message;
    $("#progressRing").textContent = "!";
    toast(`本地模型失败：${error.message}`);
    return false;
  } finally {
    stopProgressTimer();
    state.isGenerating = false;
    generateBtn.disabled = false;
    generateLabel.textContent = "生成影片";
  }
}

async function generateBytePlusVideo(prompt) {
  collectSettings();
  collectApiDirectoryKeys();
  const byteplusKey = state.settings.keys.byteplus || state.settings.videoApiKeys.byteplus;
  generateBtn.disabled = true;
  generateLabel.textContent = "Seedance 生成中";
  showPauseGeneration();
  resetPreviewVisual();
  startVideoProgress("正在创建 BytePlus Seedance 任务");

  try {
    const response = await pausableFetch("/api/generate-byteplus-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: byteplusKey,
        endpoint: state.settings.videoEndpoints?.byteplus || state.settings.byteplusEndpoint,
        workspaceId: state.settings.byteplusWorkspaceId,
        webhook: state.settings.webhook,
        model: byteplusVideoModelIds[$("#modelSelect").value] || $("#modelSelect").value,
        modelLabel: $("#modelSelect").value,
        prompt,
        negativePrompt: negativeInput.value.trim(),
        duration: $("#durationSelect").value,
        ratio: getSelectedAspectRatio(),
        size: getSelectedPixelSize(),
        quality: $("#qualitySelect").value,
        mode: state.currentMode,
        imageUrls: state.currentMode === "image" ? seedanceReferenceImageUrls() : [],
      }),
    });
    const data = await readApiJson(response, response.url || "API");
    if (!response.ok || !data.ok) throw new Error(data.error || "BytePlus 任务创建失败");
    const project = createProjectFromPrompt();
    project.model = $("#modelSelect").value;
    project.rawModel = $("#modelSelect").value;
    project.outputSize = getSelectedPixelSize();
    project.taskId = data.taskId || "";
    updateProjectStatus(project, "生成中", 28);
    setVideoProgress(32, "Seedance 任务已创建，正在等待成片");
    previewMeta.textContent = data.message || `TaskId: ${data.taskId || "已创建"}`;
    const endpoint = state.settings.videoEndpoints?.byteplus || state.settings.byteplusEndpoint;
    const finalData = data.videoUrl
      ? data
      : await waitForSeedanceVideo(data.taskId, byteplusKey, endpoint, project, "Seedance");
    project.videoUrl = finalData.videoUrl;
    updateProjectStatus(project, "影片已生成", 100);
    stopProgressTimer();
    setVideoProgress(100, "影片生成完成");
    setVideoPreview(finalData.videoUrl, project.title, `已由 BytePlus Seedance 生成 · ${project.model}`, project.outputSize);
    addLog(`${project.title} BytePlus Seedance 影片已生成，TaskId: ${data.taskId || "N/A"}`);
    toast("Seedance 影片已生成，可以预览或下载");
    return true;
  } catch (error) {
    if (isPauseError(error)) {
      stopProgressTimer();
      previewTitle.textContent = "生成已暂停";
      previewMeta.textContent = "已停止后续影片片段提交";
      return false;
    }
    stopProgressTimer();
    previewStage.className = "preview-stage idle";
    previewTitle.textContent = "Seedance REST API 失败";
    previewMeta.textContent = error.message === "Failed to fetch"
      ? "本地后端没有收到请求。请刷新页面后重新上传参考图；如果仍失败，请换小一点的图片或确认 npm start 仍在运行。"
      : error.message;
    $("#progressRing").textContent = "!";
    toast(`Seedance REST API 失败：${error.message}`);
    return false;
  } finally {
    stopProgressTimer();
    state.isGenerating = false;
    hidePauseGeneration();
    generateBtn.disabled = false;
    generateLabel.textContent = "生成影片";
  }
}

async function generateCloudVideo(prompt) {
  collectSettings();
  const model = $("#modelSelect").value;
  const providerKey = cloudVideoModelMap[model] || state.settings.videoProvider;
  const provider = videoProviders[providerKey];
  const apiKey = state.settings.videoApiKeys[providerKey] || "";
  generateBtn.disabled = true;
  generateLabel.textContent = "云端生成中";
  resetPreviewVisual();
  startVideoProgress(`正在创建 ${provider.label} 任务`);

  try {
    const response = await fetch("/api/generate-cloud-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: providerKey,
        providerLabel: provider.label,
        apiKey,
        endpoint: state.settings.videoEndpoints?.[providerKey] || state.settings.videoEndpoint || provider.endpoint,
        model,
        prompt,
        negativePrompt: negativeInput.value.trim(),
        duration: $("#durationSelect").value,
        ratio: getSelectedAspectRatio(),
        size: getSelectedPixelSize(),
        quality: $("#qualitySelect").value,
        mode: state.currentMode,
      }),
    });
    const data = await readApiJson(response, response.url || "API");
    if (!response.ok || !data.ok) throw new Error(data.error || "影片任务创建失败");
    const project = createProjectFromPrompt();
    project.model = model;
    project.rawModel = model;
    project.outputSize = getSelectedPixelSize();
    project.taskId = data.taskId || "";
    stopProgressTimer();
    if (data.videoUrl) {
      project.videoUrl = data.videoUrl;
      updateProjectStatus(project, "影片已生成", 100);
      setVideoPreview(data.videoUrl, project.title, `已由 ${provider.label} 生成 · ${model}`, project.outputSize);
      addLog(`${project.title} ${provider.label} 影片已生成`);
    } else {
      updateProjectStatus(project, data.pending ? "任务生成中" : "任务已提交", 100);
      setVideoProgress(100, data.pending ? `${provider.label} 生成中` : `${provider.label} 任务已提交`);
      previewStage.className = "preview-stage ready";
      previewTitle.textContent = data.pending ? `${provider.label} 正在生成` : `${provider.label} 任务已提交`;
      previewMeta.textContent = data.message || data.taskId || "云端服务正在后台生成影片";
      $("#progressRing").textContent = "JOB";
      addLog(`${project.title} ${provider.label} 任务已提交`);
    }
    toast(`${provider.label} 任务已创建`);
    return true;
  } catch (error) {
    stopProgressTimer();
    previewStage.className = "preview-stage idle";
    previewTitle.textContent = "云端影片生成失败";
    previewMeta.textContent = error.message;
    $("#progressRing").textContent = "!";
    toast(`云端生成失败：${error.message}`);
    return false;
  } finally {
    stopProgressTimer();
    state.isGenerating = false;
    generateBtn.disabled = false;
    generateLabel.textContent = "生成影片";
  }
}

async function generateMarketingWorkflow() {
  if (!requireAuth() || state.isGenerating) return;
  const prompt = promptInput.value.trim();
  if (prompt.length < 10) {
    toast("请先写入营销文案和具体要求");
    promptInput.focus();
    return;
  }
  collectSettings();
  collectApiDirectoryKeys();
  if (!state.settings.keys.openai) {
    openSettings();
    toast("Marketing workflow 需要先填写 OpenAI Key 来优化文案");
    return;
  }
  const selectedModel = $("#modelSelect").value;
  const selectedProvider = cloudVideoModelMap[selectedModel] || state.settings.videoProvider;
  const selectedVideoProvider = videoProviders[selectedProvider];
  const selectedVideoKey = isBytePlusVideoModel(selectedModel)
    ? state.settings.keys.byteplus || state.settings.videoApiKeys.byteplus
    : state.settings.videoApiKeys[selectedProvider];

  state.isGenerating = true;
  generateBtn.disabled = true;
  generateLabel.textContent = "运行 Workflow";
  resetPreviewVisual();
  setWorkflowProgress(10, "第 1 步：读取文案与需求", "准备交给 Seedance 分析");
  const timers = [
    [1200, 28, "第 2 步：整理镜头文案", "正在把文案整理成 Seedance 更容易理解的镜头描述"],
    [2600, 48, "第 3 步：生成分镜图", "根据文案长度规划镜头数量和每镜头内容"],
    [4200, 68, "第 4 步：提交影片模型", `把每个分镜交给 ${selectedModel} 生成`],
    [6200, 86, "第 5 步：准备剪辑结合", "整理最终剪辑顺序和成片结构"],
  ].map(([delay, percent, label, detail]) => setTimeout(() => setWorkflowProgress(percent, label, detail), delay));

  try {
    const response = await fetch("/api/marketing-workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        copy: prompt,
        audience: marketingContext().audience,
        goal: marketingContext().goal,
        channel: marketingContext().channel,
        news: marketingContext().news,
        openaiKey: state.settings.keys.openai,
        videoAdapter: isLocalVideoModel(selectedModel) ? "local" : isBytePlusVideoModel(selectedModel) ? "byteplus" : "cloud",
        provider: selectedProvider,
        providerLabel: selectedVideoProvider?.label || selectedModel,
        apiKey: selectedVideoKey,
        endpoint: isBytePlusVideoModel(selectedModel)
          ? state.settings.videoEndpoints?.byteplus || state.settings.byteplusEndpoint
          : isLocalVideoModel(selectedModel)
            ? state.settings.localVideoEndpoint
            : state.settings.videoEndpoints?.[selectedProvider] || state.settings.videoEndpoint || selectedVideoProvider?.endpoint,
        token: state.settings.localVideoToken,
        method: state.settings.localVideoMethod,
        modelDirectory: state.settings.localVideoDirectory,
        modelPath: state.settings.localVideoPath,
        textWorkflow: state.settings.localTextWorkflow,
        workspaceId: state.settings.byteplusWorkspaceId,
        model: byteplusVideoModelIds[selectedModel] || selectedModel,
        modelLabel: selectedModel,
        size: getSelectedPixelSize(),
        ratio: getSelectedAspectRatio(),
        duration: $("#durationSelect").value,
        quality: $("#qualitySelect").value,
      }),
    });
    const data = await readApiJson(response, response.url || "API");
    if (!response.ok || !data.ok) throw new Error(data.error || "Marketing workflow 失败");
    timers.forEach(clearTimeout);
    setWorkflowProgress(100, "Workflow 完成", "分镜任务已提交，剪辑结构已整理");
    setMarketingWorkflowResult(data);
    const project = createProjectFromPrompt();
    project.mode = "Marketing Workflow";
    project.model = `${selectedModel} · ChatGPT`;
    addLog(`${project.title} Marketing workflow 已完成`);
    toast("Marketing workflow 已完成");
  } catch (error) {
    timers.forEach(clearTimeout);
    previewStage.className = "preview-stage idle";
    previewTitle.textContent = "Marketing workflow 失败";
    previewMeta.textContent = error.message;
    $("#progressRing").textContent = "!";
    toast(`Workflow 失败：${error.message}`);
  } finally {
    state.isGenerating = false;
    generateBtn.disabled = false;
    generateLabel.textContent = state.currentScene === "marketing" ? "自动生成" : "生成影片";
  }
}

function generateVideo() {
  if (!requireAuth() || state.isGenerating) return;
  if (state.currentScene === "copywriter") {
    generateCopyChat();
    return;
  }
  if (state.currentScene === "marketing") {
    const prompt = promptInput.value.trim();
    if (prompt.length < 8) {
      toast("提示词再写具体一点，至少 8 个字");
      promptInput.focus();
      return;
    }
    state.isGenerating = true;
    generateBytePlusVideo(prompt);
    return;
  }
  const prompt = promptInput.value.trim();
  if (prompt.length < 8) {
    toast("提示词再写具体一点，至少 8 个字");
    promptInput.focus();
    return;
  }
  if (state.currentMode !== "imagegen" && !state.activeUploads.length) {
    toast("请先上传参考图片或素材");
    return;
  }

  state.isGenerating = true;
  if (isCloudVideoModel($("#modelSelect").value) && !isBytePlusVideoModel($("#modelSelect").value)) {
    generateCloudVideo(prompt);
    return;
  }
  if (isBytePlusVideoModel($("#modelSelect").value)) {
    generateBytePlusVideo(prompt);
    return;
  }
  if (isLocalVideoModel($("#modelSelect").value)) {
    generateLocalVideo(prompt);
    return;
  }
  generateBtn.disabled = true;
  generateLabel.textContent = "生成中";
  resetPreviewVisual();
  previewStage.className = "preview-stage generating";
  previewTitle.textContent = "正在生成影片";
  previewMeta.textContent = `${$("#modelSelect").value} · 影片时长：${selectedVideoDurationLabel()} · ${getSelectedSizeLabel()}`;

  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.floor(Math.random() * 14) + 8;
    $("#progressRing").textContent = `${Math.min(progress, 99)}%`;
    if (progress >= 100) {
      clearInterval(timer);
      state.isGenerating = false;
      generateBtn.disabled = false;
      generateLabel.textContent = "生成影片";
      const project = createProjectFromPrompt();
      project.outputSize = getSelectedPixelSize();
      updateProjectStatus(project, "已完成", 100);
      setPreviewReady(project.title, `已生成 · ${project.model} · ${$("#qualitySelect").value}`);
      addLog(`${project.title} 已完成`);
      toast("影片已生成，可以预览或下载");
    }
  }, 520);
}

function generateCurrent() {
  if (state.currentScene === "storyboard") {
    toast("当前 Seedance 模式不会调用 OpenAI/Gemini 生成分镜，请直接在 Seedance 输入提示词生成影片");
    return;
  }
  if (state.currentScene === "marketing") {
    generateVideo();
    return;
  }
  if (state.currentMode === "imagegen") {
    generateImage();
    return;
  }
  generateVideo();
}

function enhancePrompt() {
  const base = promptInput.value.trim() || "一位主角穿过未来城市";
  promptInput.value = `${base}。加入明确镜头语言：中景开场，缓慢推轨，主体保持清晰，背景有层次光影，动作自然连贯，结尾停在一个可用于封面的画面。`;
  updateCount();
  toast("已增强提示词");
}

async function optimizePromptField(target = "prompt") {
  const field = target === "negative" ? negativeInput : promptInput;
  const original = field.value.trim();
  if (!original) {
    toast("请先填写提示词");
    field.focus();
    return;
  }
  toast("Seedance 模式不会调用 OpenAI 或 Gemini 分析提示词，请直接编辑后生成");
  if (target === "negative") negativeInput.hidden = false;
  updateCount();
}

async function changePassword() {
  const account = state.currentUser || JSON.parse(localStorage.getItem("dreamforge-session") || "null");
  if (!account?.email) {
    openAuth("login");
    toast("请先登录后再修改密码");
    return;
  }
  const currentPassword = $("#currentPasswordInput").value.trim();
  const newPassword = $("#newPasswordInput").value.trim();
  const confirmPassword = $("#confirmPasswordInput").value.trim();
  if (!currentPassword || newPassword.length < 6) {
    toast("请输入当前密码，并设置至少 6 位的新密码");
    return;
  }
  if (newPassword !== confirmPassword) {
    toast("两次输入的新密码不一致");
    return;
  }
  try {
    await authRequest("/api/auth/change-password", {
      email: account.email,
      currentPassword,
      newPassword,
    });
    $("#currentPasswordInput").value = "";
    $("#newPasswordInput").value = "";
    $("#confirmPasswordInput").value = "";
    toast("密码已修改，下次登录请使用新密码");
  } catch (error) {
    toast(`修改失败：${error.message}`);
  }
}

async function deleteAccount() {
  const account = state.currentUser || JSON.parse(localStorage.getItem("dreamforge-session") || "null");
  if (!account?.email) {
    openAuth("login");
    toast("请先登录后再删除账户");
    return;
  }
  if ($("#deleteConfirmInput").value.trim() !== "DELETE") {
    toast("请输入 DELETE 确认删除账户");
    return;
  }
  const confirmed = window.confirm(`确定删除 ${account.email} 吗？这个操作会移除本机账户资料。`);
  if (!confirmed) {
    toast("已取消删除账户");
    return;
  }
  try {
    await authRequest("/api/auth/delete-account", {
      email: account.email,
      confirm: "DELETE",
    });
    localStorage.removeItem("dreamforge-session");
    state.currentUser = null;
    state.isAuthed = false;
    workspace.hidden = true;
    landing.hidden = false;
    closeSettings();
    openAuth("signup");
    toast("账户已删除");
  } catch (error) {
    toast(`删除失败：${error.message}`);
  }
}

function randomPrompt() {
  const prompts = [
    "清晨的海边公路，一辆复古跑车沿着薄雾驶来，低角度跟拍，阳光从云层穿过",
    "一只透明玻璃手表在水面上悬浮旋转，微距镜头，银色机械结构发光，广告级质感",
    "赛博朋克厨房里，机器人厨师把发光拉面端到镜头前，手持摄影，暖色蒸汽",
    "古典剧院舞台上，红色丝绸在空中变成飞鸟，镜头环绕，戏剧化聚光灯",
  ];
  promptInput.value = prompts[Math.floor(Math.random() * prompts.length)];
  updateCount();
  toast("已填入灵感提示词");
}

function simulateDownload() {
  if (!previewStage.classList.contains("ready")) {
    toast("还没有可下载的作品");
    return;
  }
  const image = $(".generated-image");
  if (image) {
    const link = document.createElement("a");
    link.href = image.src;
    link.download = "dreamforge-image.png";
    link.click();
    addLog("图片导出任务已创建");
    toast("已下载生成图片");
    return;
  }
  const video = $(".generated-video");
  if (video) {
    const link = document.createElement("a");
    link.href = /^https?:\/\//i.test(video.src)
      ? `/api/download-video?url=${encodeURIComponent(video.src)}`
      : video.src;
    link.download = "dreamforge-video.mp4";
    link.click();
    addLog("影片导出任务已创建");
    toast("已下载生成影片");
    return;
  }
  const content = `DreamForge AI Video\nProject: ${$("#workspaceTitle").textContent}\nModel: ${$("#modelSelect").value}\nPrompt: ${promptInput.value}`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dreamforge-video-export.txt";
  link.click();
  URL.revokeObjectURL(link.href);
  addLog("导出任务已创建");
  toast("已模拟下载导出文件");
}

function handleAction(action, trigger = null) {
  const actions = {
    home: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    "scroll-gallery": () => $("#gallery").scrollIntoView({ behavior: "smooth" }),
    "open-workspace": () => (state.isAuthed ? enterWorkspace() : openAuth("signup")),
    "studio-home": () => showStudioHome(),
    assets: openAssets,
    "close-assets": closeAssets,
    "demo-generate": () => {
      openAuth("signup");
      toast("演示会在注册后进入工作台");
    },
    "back-home": () => {
      workspace.hidden = true;
      landing.hidden = false;
      toast("已回到门面页");
    },
    logout: () => {
      saveProjects();
      localStorage.removeItem("dreamforge-session");
      state.currentUser = null;
      state.isAuthed = false;
      workspace.hidden = true;
      landing.hidden = false;
      openAuth("login");
    },
    "close-auth": closeAuth,
    "forgot-password": () => toast("重置密码邮件已发送"),
    "new-project": () => {
      if (state.currentScene === "copywriter") {
        startNewCopyChat();
        return;
      }
      state.currentProjectId = "";
      $("#workspaceTitle").textContent = "新建 AI 影片";
      promptInput.value = "";
      updateCount();
      previewStage.className = "preview-stage idle";
      previewTitle.textContent = "等待生成";
      previewMeta.textContent = "选择模型并输入提示词后开始";
      resetPreviewVisual();
      renderProjects();
      toast("已创建空白项目");
    },
    "collapse-sidebar": () => {
      workspace.classList.toggle("sidebar-collapsed");
      const collapsed = workspace.classList.contains("sidebar-collapsed");
      const button = $('[data-action="collapse-sidebar"]');
      button.textContent = collapsed ? "展开" : "收窄";
      button.title = collapsed ? "展开历史记录" : "收窄历史记录";
      toast(collapsed ? "左侧项目栏已收起" : "左侧项目栏已展开");
    },
    "toggle-eye-comfort": toggleEyeComfort,
    "save-draft": () => {
      saveProjects();
      addLog("草稿已保存");
      toast("草稿已保存");
    },
    "open-settings": openSettings,
    "open-admin-settings": openAdminSettings,
    "close-settings": closeSettings,
    "admin-login": adminLogin,
    "close-admin-login": closeAdminLogin,
    "prompt-enhance": () => optimizePromptField("prompt"),
    "negative-enhance": () => optimizePromptField("negative"),
    "copy-upload-reference": () => copyAttachmentInput?.click(),
    "copy-remove-reference": () => {
      const id = trigger?.dataset?.attachmentId;
      if (!id) return;
      state.copyAttachments = state.copyAttachments.filter((file) => file.id !== id);
      renderCopyAttachments();
    },
    "copy-chat-send": generateCopyChat,
    "marketing-refresh-news": loadMarketingNews,
    "marketing-next-step": () => {
      generateVideo();
    },
    "pause-generation": requestPauseGeneration,
    "marketing-back-step": () => {
      if (state.marketingStage === "video") setMarketingStage("storyboard");
      else setMarketingStage("copy");
    },
    "marketing-check-copy": () => toast("Seedance 模式不会调用 OpenAI/Gemini 检查文案，请直接生成影片"),
    "marketing-generate-image": () => toast("Seedance 模式不会调用 OpenAI/Gemini 生成分析图，请直接生成影片"),
    "marketing-generate-video": generateMarketingVideo,
    "marketing-use-news": () => {
      const title = trigger?.dataset?.newsTitle;
      if (title) {
        promptInput.value = `${promptInput.value.trim()}\n\n结合今日资讯：${title}`.trim();
        updateCount();
      }
    },
    "prompt-random": randomPrompt,
    "prompt-clear": () => {
      promptInput.value = "";
      updateCount();
      toast("提示词已清空");
    },
    "negative-toggle": () => {
      negativeInput.hidden = !negativeInput.hidden;
      toast(negativeInput.hidden ? "已隐藏负面提示词" : "已显示负面提示词");
    },
    "upload-asset": () => $("#assetUpload").click(),
    "preview-upload-asset": () => {
      const id = trigger?.dataset?.uploadId;
      if (id) previewUploadAsset(id);
    },
    "close-upload-preview": closeUploadPreview,
    "remove-upload-asset": () => {
      const id = trigger?.dataset?.uploadId;
      if (id) removeUploadAsset(id);
    },
    generate: generateCurrent,
    "preview-play": () => toast(previewStage.classList.contains("ready") ? "正在播放预览" : "暂无可播放视频"),
    download: simulateDownload,
    share: async () => {
      const text = `DreamForge 项目：${$("#workspaceTitle").textContent}`;
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      toast("分享文案已复制");
    },
    favorite: () => {
      const project = state.projects.find((item) => item.id === state.currentProjectId);
      if (project) project.favorite = !project.favorite;
      renderProjects();
      toast(project?.favorite ? "已收藏项目" : "已取消收藏");
    },
    regenerate: () => {
      toast("已使用当前参数重新排队");
      generateCurrent();
    },
    upscale: () => {
      addLog("提高分辨率任务已加入队列");
      toast("提高分辨率已开始");
    },
    "project-chat-send": sendProjectModification,
    "clear-log": () => {
      state.logs = [];
      if (renderLog) renderLog.innerHTML = "";
      toast("生成记录已清除");
    },
    "copy-config": async () => {
      collectSettings();
      const summary = `DreamForge 设置摘要
图片服务商: ${imageProviders[state.settings.imageProvider].label}
图片模型: ${state.settings.imageModel}
当前生成尺寸: ${getSelectedPixelSize()}
影片服务商: ${videoProviders[state.settings.videoProvider].label}
影片模型: ${state.settings.videoModel}
本地影片模型: ${state.settings.localVideoModel}
本地模型目录: ${state.settings.localVideoDirectory || "未配置"}
本地模型路径: ${state.settings.localVideoPath || "未配置"}
本地影片服务: ${state.settings.localVideoEndpoint || "未配置"}
API Keys: ${Object.entries(imageProviders)
        .map(([key, item]) => `${item.label}=${maskKey(state.settings.keys[key])}`)
        .join(", ")}`;
      if (navigator.clipboard) await navigator.clipboard.writeText(summary);
      toast("已复制遮罩后的配置摘要");
    },
    "clear-keys": () => {
      Object.values(imageProviders).forEach((item) => {
        if (item.keyField) $(`#${item.keyField}`).value = "";
      });
      $$("[data-api-key-input]").forEach((input) => {
        input.value = "";
      });
      collectSettings();
      collectApiDirectoryKeys();
      persistSettings();
      updateKeyStatus();
      toast("API Keys 已清空");
    },
    "change-password": changePassword,
    "delete-account": deleteAccount,
    "test-local-video": async () => {
      collectSettings();
      if (!state.settings.localVideoEndpoint) {
        toast("请先填写本地影片服务地址");
        return;
      }
      try {
        const response = await fetch("/api/test-local-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: state.settings.localVideoEndpoint,
            modelDirectory: state.settings.localVideoDirectory,
            modelPath: state.settings.localVideoPath,
            textWorkflow: state.settings.localTextWorkflow,
            imageWorkflow: state.settings.localImageWorkflow,
            token: state.settings.localVideoToken,
            method: state.settings.localVideoMethod,
          }),
        });
        const data = await readApiJson(response, response.url || "API");
        toast(response.ok && data.ok ? "本地影片服务连接成功" : `本地服务不可用：${data.error || "连接失败"}`);
      } catch {
        toast("本地 API 后端未启动，请使用 npm start");
      }
    },
    "test-byteplus": async () => {
      collectSettings();
      if (!state.settings.keys.byteplus) {
        toast("请先填写 BytePlus API Key");
        return;
      }
      try {
        const response = await fetch("/api/test-byteplus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: state.settings.keys.byteplus,
            endpoint: state.settings.videoEndpoints?.byteplus || state.settings.byteplusEndpoint,
          }),
        });
        const data = await readApiJson(response, response.url || "API");
        toast(response.ok && data.ok ? (data.message || "Seedance 测试草稿已提交") : `Seedance 测试失败：${data.error || "连接失败"}`, { force: true });
      } catch {
        toast("本地 API 后端未启动，请使用 npm start");
      }
    },
    "save-video-api-key": () => {
      collectSettings();
      persistSettings();
      updateVideoApiStatus();
      toast(`${videoProviders[state.settings.videoProvider].label} API Key 已保存到本地设置`);
    },
    "delete-video-api-key": () => {
      collectSettings();
      const providerKey = state.settings.videoProvider;
      const provider = videoProviders[providerKey];
      deleteApiProviderKey("video", providerKey);
      toast(`${provider.label} API Key 已删除`);
    },
    "test-video-api": async () => {
      collectSettings();
      const provider = videoProviders[state.settings.videoProvider];
      const apiKey = state.settings.videoApiKeys[state.settings.videoProvider];
      if (!apiKey) {
        toast(`请先填写 ${provider.label} API Key`);
        return;
      }
      try {
        const response = await fetch(state.settings.videoProvider === "byteplus" ? "/api/test-byteplus" : "/api/test-cloud-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: state.settings.videoProvider,
            providerLabel: provider.label,
            apiKey,
            endpoint: state.settings.videoEndpoints?.[state.settings.videoProvider] || state.settings.videoEndpoint || provider.endpoint,
            model: state.settings.videoModel,
          }),
        });
        const data = await readApiJson(response, response.url || "API");
        toast(response.ok && data.ok ? (data.message || `${provider.label} API 配置可用`) : `${provider.label} 测试失败：${data.error || "连接失败"}`, { force: true });
      } catch {
        toast("本地 API 后端未启动，请使用 npm start");
      }
    },
    "save-api-directory": () => {
      collectSettings();
      collectApiDirectoryKeys();
      persistSettings();
      toast("全部 API Keys 已保存");
    },
    "test-api-provider": async () => {
      const button = trigger;
      const type = button?.dataset?.apiType;
      const providerKey = button?.dataset?.providerKey;
      if (!type || !providerKey) {
        toast("请选择要测试的 API");
        return;
      }
      collectSettings();
      collectApiDirectoryKeys();
      const input = $(`[data-api-key-input="${type}:${providerKey}"]`);
      const apiKey = input?.value.trim();
      if (!apiKey) {
        toast("请先填入 API Key");
        return;
      }
      button.disabled = true;
      const oldText = button.textContent;
      button.textContent = "测试中";
      try {
        const provider = type === "video" ? videoProviders[providerKey] : type === "llm" ? llmProviders[providerKey] : imageProviders[providerKey];
        const endpoint = type === "video"
          ? state.settings.videoEndpoints?.[providerKey] || provider?.endpoint || ""
          : provider?.endpoint || "";
        const url = type === "video" && providerKey === "byteplus"
          ? "/api/test-byteplus"
          : type === "video"
            ? "/api/test-cloud-video"
            : type === "llm"
              ? "/api/generate-copy-chat"
              : "/api/test-provider";
        const body = type === "video"
          ? { provider: providerKey, providerLabel: provider.label, apiKey, endpoint, model: provider.models?.[0] }
          : type === "llm"
            ? { provider: providerKey, providerLabel: provider.label, model: provider.models[0], apiKey, prompt: "请回复：LLM API 连接正常。", history: [], attachments: [] }
            : { provider: providerKey, apiKey };
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await readApiJson(response, response.url || "API");
        const successMessage = providerKey === "byteplus"
          ? (data.message || "Seedance 测试草稿已提交")
          : `${provider.label} API 测试通过`;
        toast(response.ok && data.ok ? successMessage : `${provider.label} 测试失败：${data.error || "服务不可用"}`, { force: true });
      } catch {
        toast("测试失败：请确认本地后端已启动");
      } finally {
        button.disabled = false;
        button.textContent = oldText;
      }
    },
    "delete-api-provider-key": () => {
      const button = trigger;
      const type = button?.dataset?.apiType;
      const providerKey = button?.dataset?.providerKey;
      if (!type || !providerKey) {
        toast("请选择要删除的 API Key");
        return;
      }
      deleteApiProviderKey(type, providerKey);
      toast("API Key 已删除");
    },
    "metric-speed": () => toast("快速预览适合草稿和镜头测试"),
    "metric-model": () => toast("可在 Seedance、Kling、Sora、Runway、Pika 间切换"),
    "metric-export": () => toast("高清与 4K 导出适合正式成片"),
    "sample-cinematic": () => {
      promptInput.value = "电影感街头追逐镜头，雨夜反光地面，手持摄影，主角穿过霓虹巷口";
      updateCount();
      toast("电影感示例已准备好");
    },
    "sample-product": () => toast("产品广告模板已选中"),
    "sample-avatar": () => toast("图片转视频模板已选中"),
    "sample-remix": () => toast("视频重绘模板已选中"),
  };
  if (actions[action]) actions[action]();
  else toast("操作已收到");
}

document.addEventListener("click", (event) => {
  const authButton = event.target.closest("[data-auth]");
  if (authButton) openAuth(authButton.dataset.auth);

  const authTab = event.target.closest("[data-auth-tab]");
  if (authTab) setAuthMode(authTab.dataset.authTab);

  const modeTab = event.target.closest("[data-mode]");
  if (modeTab) setMode(modeTab.dataset.mode);

  const assetFilter = event.target.closest("[data-asset-filter]");
  if (assetFilter) {
    state.assetFilter = assetFilter.dataset.assetFilter;
    renderAssets();
    return;
  }

  const assetCard = event.target.closest("[data-asset-project-id]");
  if (assetCard) {
    closeAssets();
    loadProject(assetCard.dataset.assetProjectId);
    return;
  }

  const filter = event.target.closest("[data-filter]");
  if (filter) {
    state.filter = filter.dataset.filter;
    $$(".chip").forEach((chip) => chip.classList.toggle("active", chip === filter));
    renderProjects();
    toast(filter.dataset.filter === "all" ? "显示全部项目" : "只显示收藏项目");
  }

  const studioFilter = event.target.closest("[data-studio-filter]");
  if (studioFilter) {
    filterStudioHome(studioFilter.dataset.studioFilter);
    return;
  }

  const studioLaunch = event.target.closest("[data-studio-launch]");
  if (studioLaunch) {
    launchStudioWorkspace({
      mode: studioLaunch.dataset.mode,
      model: studioLaunch.dataset.model,
      scene: studioLaunch.dataset.scene,
    });
    return;
  }

  const searchResult = event.target.closest("[data-search-result]");
  if (searchResult) {
    openSearchResult(searchResult.dataset.searchResult);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-project-id]");
  if (deleteButton) {
    deleteProject(deleteButton.dataset.deleteProjectId);
    return;
  }

  const project = event.target.closest("[data-project-id]");
  if (project) loadProject(project.dataset.projectId);

  const modelPill = event.target.closest("[data-model-name]");
  if (modelPill) {
    const type = modelPill.dataset.apiType;
    const providerKey = modelPill.dataset.providerKey;
    const modelName = modelPill.dataset.modelName;
    collectSettings();
    collectApiDirectoryKeys();
    if (type === "image") {
      state.settings.imageProvider = providerKey;
      state.settings.imageModel = modelName;
      $("#imageProviderSetting").value = providerKey;
      populateImageModels();
      $("#imageModelSetting").value = modelName;
      if (state.currentMode === "imagegen") populateWorkspaceModels();
      toast(`已选择生图模型：${modelName}`);
    } else {
      state.settings.videoProvider = providerKey;
      state.settings.videoModel = modelName;
      $("#videoProviderSetting").value = providerKey;
      populateVideoModels();
      $("#videoModelSetting").value = modelName;
      populateWorkspaceModels();
      toast(`已选择影片模型：${modelName}`);
    }
    return;
  }

  const action = event.target.closest("[data-action]");
  if (action) {
    if (action.dataset.action === "toggle-key") {
      const input = $(`#${action.dataset.keyInput}`);
      input.type = input.type === "password" ? "text" : "password";
      action.textContent = input.type === "password" ? "显示" : "隐藏";
      toast(input.type === "password" ? "API Key 已重新遮罩" : "正在临时显示 API Key");
      return;
    }
    if (action.dataset.action === "toggle-api-secret") {
      const input = $(`[data-api-key-input="${action.dataset.apiKeyTarget}"]`);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      action.textContent = input.type === "password" ? "显示" : "隐藏";
      toast(input.type === "password" ? "API Key 已重新遮罩" : "正在临时显示 API Key");
      return;
    }
    if (action.dataset.action === "test-key") {
      collectSettings();
      const provider = action.dataset.provider;
      const key = state.settings.keys[provider];
      if (!key) {
        toast(`${imageProviders[provider].label} 尚未填写 API Key`);
        return;
      }
      fetch("/api/test-provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: key }),
      })
        .then((response) => readApiJson(response, "/api/test-provider").then((data) => ({ ok: response.ok, data })))
        .then(({ ok, data }) => toast(ok && data.ok ? `${imageProviders[provider].label} 联网测试通过` : `联网测试失败：${data.error || "服务不可用"}`))
        .catch((error) => toast(error.message || "本地 API 后端未启动，请使用 npm start"));
      return;
    }
    handleAction(action.dataset.action, action);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeUploadPreview();
  if (event.key !== "Enter" && event.key !== " ") return;
  const uploadChip = event.target.closest?.("[data-action='preview-upload-asset']");
  if (!uploadChip) return;
  event.preventDefault();
  previewUploadAsset(uploadChip.dataset.uploadId);
});

$("#authForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  state.authProvider = "email";
  const email = $("#emailInput").value.trim();
  const password = $("#passwordInput").value.trim();
  if (!email.includes("@")) {
    toast("请输入有效邮箱");
    return;
  }
  if (password.length < 6) {
    toast("密码至少 6 位");
    return;
  }
  try {
    if (state.authMode === "signup") {
      const data = await authRequest("/api/auth/register", {
        email,
        password,
        name: $("#nameInput").value.trim(),
        provider: "email",
      });
      showVerificationNotice("注册成功，账户已记录在这台设备。请使用刚刚的邮箱和密码登录。");
      toast("注册成功，已保存在本机");
      return;
    }
    const data = await authRequest("/api/auth/login", { email, password, provider: "email" });
    state.currentUser = data.user;
    localStorage.setItem("dreamforge-session", JSON.stringify(data.user));
    updateRememberedLogin(email, password);
    updateSecurityAccount();
    toast("登录成功");
    enterWorkspace();
  } catch (error) {
    showVerificationNotice(error.message);
    toast(error.message);
  }
});

rememberPasswordInput?.addEventListener("change", () => {
  const { email, password } = currentLoginInput();
  updateRememberedLogin(email, password);
  if (rememberPasswordInput.checked && (!email || !password)) {
    toast("填写邮箱和密码后会自动保存在这台设备");
    return;
  }
  toast(rememberPasswordInput.checked ? "已在这台设备记住账号和密码" : "已取消本机记住密码");
});

adminPasswordInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  adminLogin();
});

["#emailInput", "#passwordInput"].forEach((selector) => {
  $(selector)?.addEventListener("input", () => {
    if (!rememberPasswordInput.checked) return;
    const { email, password } = currentLoginInput();
    updateRememberedLogin(email, password);
  });
});

$("#settingsForm").addEventListener("submit", (event) => {
  event.preventDefault();
  saveSettings();
});

$("#settingsForm").addEventListener("input", () => {
  settingsSavedState.textContent = "未保存";
  collectSettings();
  updateKeyStatus();
  updateCustomSizePreview();
});

$("#imageProviderSetting").addEventListener("change", () => {
  collectSettings();
  populateImageModels();
  populateWorkspaceModels();
  settingsSavedState.textContent = "未保存";
  toast(`图片服务商已切换到 ${imageProviders[state.settings.imageProvider].label}`);
});

$("#imageModelSetting").addEventListener("change", () => {
  collectSettings();
  populateWorkspaceModels();
  settingsSavedState.textContent = "未保存";
  toast(`图片模型已切换到 ${state.settings.imageModel}`);
});

$("#videoProviderSetting").addEventListener("change", () => {
  collectSettings();
  populateVideoModels();
  $("#videoProviderKeySetting").value = state.settings.videoProvider === "byteplus"
    ? seedanceRestApiKey()
    : state.settings.videoApiKeys[state.settings.videoProvider] || "";
  $("#videoEndpointSetting").value =
    state.settings.videoEndpoints?.[state.settings.videoProvider] ||
    videoProviders[state.settings.videoProvider].endpoint;
  state.settings.videoEndpoint = $("#videoEndpointSetting").value;
  settingsSavedState.textContent = "未保存";
  toast(`影片服务商已切换到 ${videoProviders[state.settings.videoProvider].label}`);
});

$("#videoModelSetting").addEventListener("change", () => {
  collectSettings();
  settingsSavedState.textContent = "未保存";
  toast(`影片模型已切换到 ${state.settings.videoModel}`);
});

["#videoProviderKeySetting", "#videoEndpointSetting"].forEach((selector) => {
  $(selector).addEventListener("change", () => {
    collectSettings();
    updateVideoApiStatus();
    settingsSavedState.textContent = "未保存";
  });
});

$("#localVideoModelSetting").addEventListener("change", () => {
  collectSettings();
  settingsSavedState.textContent = "未保存";
  toast(`本地影片模型已切换到 ${state.settings.localVideoModel}`);
});

["#localVideoDirectorySetting", "#localVideoPathSetting", "#localTextWorkflowSetting", "#localImageWorkflowSetting", "#localVideoEndpointSetting", "#localVideoTokenSetting", "#localVideoMethodSetting", "#byteplusEndpointSetting", "#byteplusWorkspaceSetting"].forEach((selector) => {
  $(selector).addEventListener("change", () => {
    collectSettings();
    settingsSavedState.textContent = "未保存";
  });
});

["#imageSizeSetting", "#customWidthSetting", "#customHeightSetting", "#customUnitSetting", "#customDpiSetting", "#customBaseSetting"].forEach((selector) => {
  $(selector).addEventListener("input", () => {
    collectSettings();
    updateCustomSizePreview();
  });
  $(selector).addEventListener("change", () => {
    collectSettings();
    updateCustomSizePreview();
    toast(`图片尺寸已设为 ${getImagePixelSize()}`);
  });
});

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-settings-tab]");
  if (!tab) return;
  $$(".settings-tab").forEach((item) => item.classList.toggle("active", item === tab));
  $$(".settings-section").forEach((section) => {
    section.classList.toggle("active", section.dataset.settingsSection === tab.dataset.settingsTab);
  });
});

promptInput.addEventListener("input", updateCount);
copyChatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    generateCopyChat();
  }
});
copyAttachmentInput?.addEventListener("change", (event) => {
  addCopyReferenceFiles(event.target.files);
});
$("#assetUpload").addEventListener("change", async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const currentProject = state.projects.find((item) => item.id === state.currentProjectId);
  const preparedFiles = [];
  for (const file of files) {
    const isImage = /^image\//.test(file.type || "");
    const dataUrl = isImage ? await compressImageForSeedance(file) : "";
    const upload = {
      id: `u${Date.now()}${Math.random().toString(16).slice(2)}`,
      name: file.name,
      kind: uploadKind(file),
      type: isImage ? "image/jpeg" : file.type || "unknown",
      dataUrl,
      previewUrl: isImage ? "" : URL.createObjectURL(file),
      size: isImage ? dataUrlByteSize(dataUrl) : file.size,
    };
    preparedFiles.push(upload);
    state.uploads.unshift({
      id: upload.id,
      name: file.name,
      kind: upload.kind,
      type: upload.type,
      mode: $(".mode-tab.active")?.textContent || state.currentMode,
      projectTitle: currentProject?.title || $("#workspaceTitle").textContent,
      createdAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    });
  }
  state.activeUploads.push(...preparedFiles);
  state.activeUpload = state.activeUploads[state.activeUploads.length - 1] || null;
  updateUploadSummary();
  saveUploads();
  event.target.value = "";
  toast(`已添加 ${preparedFiles.length} 个素材`);
});
$("#modelSelect").addEventListener("change", (event) => {
  if (state.currentMode === "imagegen") {
    const providerKey = imageModelProviderMap[event.target.value] || state.settings.imageProvider;
    state.settings.imageProvider = providerKey;
    state.settings.imageModel = event.target.value;
    $("#imageProviderSetting").value = providerKey;
    populateImageModels();
    $("#imageModelSetting").value = event.target.value;
  } else if (isCloudVideoModel(event.target.value)) {
    const providerKey = cloudVideoModelMap[event.target.value];
    state.settings.videoProvider = providerKey;
    state.settings.videoModel = event.target.value;
    $("#videoProviderSetting").value = providerKey;
    populateVideoModels();
    $("#videoModelSetting").value = event.target.value;
  } else if (isLocalVideoModel(event.target.value)) {
    state.settings.localVideoModel = event.target.value;
    $("#localVideoModelSetting").value = event.target.value;
  }
  toast(`已切换模型：${event.target.value}`);
});
$("#durationSelect").addEventListener("change", (event) => toast(`时长已设为 ${event.target.value}`));
$("#ratioSelect").addEventListener("change", () => {
  updateGeneratorSizeControls();
  toast(`尺寸已设为 ${getSelectedSizeLabel()}`);
});
["#generatorCustomWidth", "#generatorCustomHeight"].forEach((selector) => {
  $(selector).addEventListener("input", () => {
    updateGeneratorSizeControls();
    toast(`自定义尺寸：${getSelectedPixelSize()}`);
  });
});
$("#qualitySelect").addEventListener("change", (event) => toast(`质量已设为 ${event.target.value}`));
$("#safeMode")?.addEventListener("change", (event) => toast(event.target.checked ? "安全生成已开启" : "安全生成已关闭"));
$("#studioSearch").addEventListener("input", () => {
  renderStudioSearchResults($("#studioSearch").value);
});

loadEyeComfort();
loadSettings();
state.uploads = readUploads();
state.projects = readProjects();
state.projectsLoaded = true;
const sessionUser = JSON.parse(localStorage.getItem("dreamforge-session") || "null");
if (sessionUser?.email) {
  state.currentUser = sessionUser;
}
const params = new URLSearchParams(window.location.search);
if (verifyLocalHashToken() || params.get("verified") === "1") {
  openAuth("login");
  showVerificationNotice("邮箱验证成功，现在可以登录。");
  window.history.replaceState({}, "", window.location.pathname);
}
renderProjects();
renderProjectChat();
addLog("工作台已准备就绪");
updateCount();
