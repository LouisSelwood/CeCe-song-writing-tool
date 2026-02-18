
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  popoutWindow: (win) => ipcRenderer.invoke('popout-window', win),
  send: (channel, data) => ipcRenderer.send(channel, data),
  getState: () => ipcRenderer.invoke("store:get"),
  onStateUpdate: (callback) => {
    const handler = (_, state) => callback(state);
    ipcRenderer.on("store:update", handler);

    return () => {
      ipcRenderer.removeListener("store:update", handler);
    };
  },
  dispatch: (action, payload) => ipcRenderer.send("store:dispatch", { action, payload }),
  onDispatch: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on("store:dispatch", handler);

    return () => ipcRenderer.removeListener("store:dispatch", handler);
  },

})
contextBridge.exposeInMainWorld("electronAPI", {
  closePopout: (id) => ipcRenderer.invoke("close-popout", id)
});

