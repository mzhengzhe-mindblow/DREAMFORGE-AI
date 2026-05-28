const path = require("path");
const { app, BrowserWindow, shell } = require("electron");

process.env.DREAMFORGE_DATA_DIR = path.join(app.getPath("userData"), "data");
process.env.HOST = "127.0.0.1";
process.env.PORT = "0";

const { server, host } = require("./server");

let mainWindow;

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1180,
    minHeight: 760,
    title: "DreamForge",
    backgroundColor: "#080a0b",
    icon: path.join(__dirname, "assets", "dreamforge-brand.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadURL(`http://${host}:${port}/index.html`);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  server.listen(0, host, () => {
    const address = server.address();
    createWindow(address.port);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0 && server.listening) {
      createWindow(server.address().port);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (server.listening) server.close();
});
