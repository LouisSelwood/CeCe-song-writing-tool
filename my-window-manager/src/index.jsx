//MAIN PROCESS

import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AppShell } from "./view/app-shell/AppShell.jsx";
import { createStore } from "./state/store/createStore.js";
import { initialState } from "./state/store/initialState.js";
import { actions } from "./state/store/actions.js";
import { domain } from "./domain/index.js";

const store = createStore(initialState, actions, domain); //creates the global store

//sends initial state to the shared store (for popout windows)
window.api.send("store:init", store.getState());

//Subscriber: recieves IPC event "store:dispatch" from electron.js through API and executes action
window.api.onDispatch(({ action, payload }) => {
  store.actions[action](payload);
});


//Publisher: publishes message newState to be intercepted by electron.js
store.subscribe((newState) => {
  window.api.send("store:update", newState);
});


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppShell store={store} />
  </React.StrictMode>
);

store.actions.openWindow("Chord Workshop");
store.actions.openWindow("Song Editor");
store.actions.openWindow("Settings");

//store.actions.dockWindow({id: store.state.windows.allIDs[0], dock: "left"})
