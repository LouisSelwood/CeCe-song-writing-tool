console.log("YO")
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    title: "Ce-Ce",
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  win.loadURL('http://localhost:5173');
}
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function createPopoutWindow(win){
  const popout = new BrowserWindow({
    title: win.type,
    width: win.width,
    height: win.height,
    icon: path.join(__dirname, "assets/Music.ico"),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  popout.setMenu(null);

  // Load the popout renderer entry point
  popout.loadURL(`http://localhost:5173/popout.html?id=${win.id}`);
  return popout;
}

const { ipcMain } = require('electron');
ipcMain.handle('popout-window', (event, win) => {
  createPopoutWindow(win);
});
let sharedState = null;

ipcMain.on("store:init", (event, state) => {
  sharedState = state;
});

ipcMain.on("store:update", (event, state) => {
  sharedState = state;

  // Broadcast to all popouts
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send("store:update", state);
  });
});

ipcMain.on("store:dispatch", (event, { action, payload }) => {
  // Forward to main window
  const mainWindow = BrowserWindow.getAllWindows()[0];
  mainWindow.webContents.send("store:dispatch", { action, payload });
});

ipcMain.handle("store:get", () => sharedState);
