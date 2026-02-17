import React from "react";
import ReactDOM from "react-dom/client";
import { AppShell } from "./view/app-shell/AppShell.jsx";
import { createStore } from "./state/store/createStore.js";
import { initialState } from "./state/store/initialState.js";
import { actions } from "./state/store/actions.js";
import { domain } from "./domain/index.js";

const store = createStore(initialState, actions, domain);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppShell store={store}/>);

store.actions.openWindow("Chord Workshop");
store.actions.openWindow("Song Editor");
store.actions.openWindow("Settings");