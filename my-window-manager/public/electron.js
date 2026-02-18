const popoutWindows = {};
let mainWindow = null;
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Ce-Ce",
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });


  mainWindow.loadURL('http://localhost:5173');
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
  //popout.setMenu(null);

  // Load the popout renderer entry point
  popout.loadURL(`http://localhost:5173/popout.html?id=${win.id}`);

  popoutWindows[win.id] = popout;

  // ⭐ Clean up when closed
  popout.on("closed", () => {
    delete popoutWindows[win.id];
  });
  return popout;

}

const { ipcMain } = require('electron');
ipcMain.handle('popout-window', (event, win) => {
  createPopoutWindow(win);
});
let sharedState = null;

ipcMain.on("store:init", (event, state) => {
  sharedState = state;
  console.log(`Init Received State: ${sharedState}`)

});

ipcMain.on("store:update", (event, state) => {
  sharedState = state;

  // Broadcast to all popouts
  Object.values(popoutWindows).forEach((win, index) => {
    win.webContents.send("store:update", state);
  });
});

ipcMain.on("store:dispatch", (event, data) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("store:dispatch", data);
  }
});


ipcMain.handle("store:get", () => sharedState);


ipcMain.handle("close-popout", (event, id) => {
  const win = popoutWindows[id];
  if (win && !win.isDestroyed()) {
    win.close();
  }
});
