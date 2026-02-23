
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

})
contextBridge.exposeInMainWorld("electronAPI", {
  closePopout: (id) => ipcRenderer.invoke("close-popout", id),
  getAppBounds: () => ipcRenderer.invoke("get-app-bounds")

});

