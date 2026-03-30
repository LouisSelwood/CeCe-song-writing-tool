
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  popoutWindow: (win) => ipcRenderer.invoke('popout-window', win),

  send: (channel, data) => ipcRenderer.send(channel, data),

  getState: () => ipcRenderer.invoke("store:get"),

  //recieves IPC Event "store:update", extracts the newState using a handler and calls the callback referenced inside useCreateStore.js
  onStateUpdate: (callback) => {
    const handler = (_, state) => callback(state);
    ipcRenderer.on("store:update", handler);

    return () => {
      ipcRenderer.removeListener("store:update", handler);
    };
  },
  //publishes dispatch message for electron.js to intercept
  dispatch: (action, payload) => ipcRenderer.send("store:dispatch", { action, payload }),

  //recieves IPC Event "store:dispatch", extracts the package using a handler and calls callback referenced inside index.jsx
  onDispatch: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on("store:dispatch", handler);

    return () => ipcRenderer.removeListener("store:dispatch", handler);
  },

  writeFile: (path, data) => ipcRenderer.invoke("write-file", path, data),

  renameFile: (oldPath, newPath) => ipcRenderer.invoke("rename-file", oldPath, newPath),

  loadFile: (path) => ipcRenderer.invoke("load-file", path)


})
contextBridge.exposeInMainWorld("electronAPI", {
  closePopout: (id) => ipcRenderer.invoke("close-popout", id),
  getAppBounds: () => ipcRenderer.invoke("get-app-bounds"),
  onMenuSaveProject: (callback) => ipcRenderer.on('menu-save-project', callback),
  onMenuSaveAs: (callback) => ipcRenderer.on('menu-save-as', callback),
  onMenuLoadProject: (callback) => ipcRenderer.on('menu-load-project', callback),
  onRunTestFunction: (callback) => ipcRenderer.on('run-test-function', callback),
  openProjectDialog: () => ipcRenderer.invoke('open-project-dialog'),
  saveProjectAsDialog: () => ipcRenderer.invoke('save-project-as-dialog'),
  showError: (title, message) =>
    ipcRenderer.invoke('show-error', { title, message })




});

