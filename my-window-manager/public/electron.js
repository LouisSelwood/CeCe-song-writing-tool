const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  console.log("Creating Electron window...");

  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    x: 100,
    y: 100,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load CRA dev server
  win.loadURL("http://localhost:3001");
  win.webContents.on("did-finish-load", () => {
  console.log("Electron loaded the page");
  });
  win.webContents.on("did-fail-load", (e, code, desc) => {
    console.log("Electron failed to load:", code, desc);
  });

  // Optional: open DevTools automatically
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});