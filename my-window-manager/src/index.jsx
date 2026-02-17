import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AppShell } from "./view/app-shell/AppShell.jsx";
import { createStore } from "./state/store/createStore.js";
import { initialState } from "./state/store/initialState.js";
import { actions } from "./state/store/actions.js";
import { domain } from "./domain/index.js";

const store = createStore(initialState, actions, domain);

window.api.send("store:init", store.getState());
console.log("Sending initial state:", store.getState());


window.api.onDispatch(({ action, payload }) => {
  store.actions[action](payload);
});

// Send updates to main
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
