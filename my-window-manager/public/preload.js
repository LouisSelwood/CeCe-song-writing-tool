
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  popoutWindow: (win) => ipcRenderer.invoke('popout-window', win),
  send: (channel, data) => ipcRenderer.send(channel, data),
  getState: () => ipcRenderer.invoke("store:get"),
  onStateUpdate: (callback) => ipcRenderer.on("store:update", (_, state) => callback(state)),
  onDispatch: (callback) => {
  ipcRenderer.on("store:dispatch", (_, data) => callback(data))}
});

