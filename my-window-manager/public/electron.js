const popoutWindows = {};
let mainWindow = null;
const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require("child_process");

let pythonProcess;


//Creates Custom Electron Settings
function addSettings() {
  const currentMenu = Menu.getApplicationMenu();
  const template = currentMenu.items.map(item => {
    if (item.label === 'File') {
      return {
        label: 'File',
        submenu: [
          {
            label: 'Save',
            accelerator: 'CmdOrCtrl+S',
            click: (menuItem, browserWindow) => {
              if (browserWindow) {
                browserWindow.webContents.send('menu-save-project');
              }
            }
          },
          {
            label: 'Save As',
            accelerator: 'Shift+CmdOrCtrl+S',
            click: (menuItem, browserWindow) => {
              if (browserWindow) {
                browserWindow.webContents.send('menu-save-as');
              }
            }
          },
          {
            label: 'Load Project',
            accelerator: 'CmdOrCtrl+O',
            click: (menuItem, browserWindow) => {
              if (browserWindow) {
                browserWindow.webContents.send('menu-load-project');
              }
            }
          },
          {
            label: 'Test',
            accelerator: 'CmdTrCtrl+T',
            click: (menuItem, browserWindow) => {
              if (browserWindow) {
                browserWindow.webContents.send('run-test-function');
              }
            }
          },
          {
            label: 'Test2',
            accelerator: 'CmdLrCtrl+L',
            click: (menuItem, browserWindow) => {
              if (browserWindow) {
                browserWindow.webContents.send('run-test-function2');
              }
            }
          },

          { type: 'separator' },

          // Keep any existing File menu items
          ...item.submenu.items.map(i => i)
        ]
      };
    }

    // Leave all other menus unchanged
    return item;
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

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

  addSettings(); //Injects the custom settings

  mainWindow.on("closed", () => {
    Object.values(popoutWindows).forEach((win) => {
      win.close()
    })
  })
}

function startPythonBackend() {
  pythonProcess = spawn("python", ["../../cece-backend/start_backend.py"], {
    cwd: __dirname,
    //shell: true
  });

  pythonProcess.stdout.on("data", data => {
    console.log(`PYTHON: ${data}`);
  });

  pythonProcess.stderr.on("data", data => {
    console.error(`PYTHON ERROR: ${data}`);
  });

  pythonProcess.on("close", code => {
    console.log(`Python backend exited with code ${code}`);
  });
}

app.whenReady().then(() => {
  startPythonBackend();
  createWindow();
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on("before-quit", () => {
  if (pythonProcess) {
    pythonProcess.kill();
    console.log("python process killed")
  }
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

  // Clean up when closed
  popout.on("closed", () => {
    delete popoutWindows[win.id];
  });
  return popout;

}



//IPC Handling
const { ipcMain } = require('electron');

//Receives IPC even for "popout-window" and creates a new electron window
ipcMain.handle('popout-window', (event, win) => {
  createPopoutWindow(win);
});
let sharedState = null;

//Broker: Receives initial state from index.jsx and stores it
ipcMain.on("store:init", (event, state) => {
  sharedState = state;
});

//invoked by useSharedState, returns state recieved from index.jsx above
ipcMain.handle("store:get", () => sharedState);

//Broker: listens for IPC event "store:update" from index.jsx and forwards message to all popout windows
ipcMain.on("store:update", (event, state) => {
  sharedState = state;
  // Broadcast to all popouts
  Object.values(popoutWindows).forEach((win, index) => {
    win.webContents.send("store:update", state);
  });
});

//Broker: listens for IPC event "store:dispatch" from useSharedStore.js and forwards message to the main window
ipcMain.on("store:dispatch", (event, data) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("store:dispatch", data);
  }
});

//invoked by pop out window, closes the window
ipcMain.handle("close-popout", (event, id) => {
  const win = popoutWindows[id];
  if (win && !win.isDestroyed()) {
    win.close();
  }
});

ipcMain.handle("get-app-bounds", () => {
  return mainWindow.getBounds(); 
;
});

ipcMain.handle("write-file", async (event, path, data) => {
  const fs = require("fs/promises");
  await fs.writeFile(path, data, "utf8");
});

ipcMain.handle("rename-file", async (event, oldPath, newPath) => {
  const fs = require("fs/promises");
  await fs.rename(oldPath, newPath);
});

ipcMain.handle("load-file", async (event, path) => {
  const fs = require("fs/promises");
  const data = await fs.readFile(path, "utf8");
  return data;
})



const { dialog } = require('electron');

ipcMain.handle('show-error', (_, { title, message }) => {
  dialog.showErrorBox(title, message);
});

ipcMain.handle('open-project-dialog', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Load Project',
    buttonLabel: 'Load',
    properties: ['openFile'],
    filters: [
      { name: 'CeCe Projects', extensions: ['cecep'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('save-project-as-dialog', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Save Project Folder',
    buttonLabel: 'Save As',
    properties: ['openDirectory'],
    filters: [
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled) return null;
  return result.filePaths[0];
});

