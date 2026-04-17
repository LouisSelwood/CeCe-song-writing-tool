//MAIN PROCESS

import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AppShell } from "./view/app-shell/AppShell.jsx";
import { createStore } from "./state/store/createStore.js";
import { initialState } from "./state/store/initialState.js";
import { selectors } from "./state/store/selectors.js";
import { actions } from "./state/store/actions.js";
import { domain } from "./domain/index.js";
import song from '../../test/TestSongs/dont-look-back-in-anger.json';
import { loadInstrument } from "./audio/midiWrapper.js";

const store = createStore(initialState, actions, selectors, domain); //creates the global store

  //store.actions.createNewProject("Don't Look Back In Anger");
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


//loads default midi instrument

loadInstrument("violin");

//Listens for file I/O Events.
window.electronAPI.onMenuSaveProject(() => {
  store.actions.saveProject();
});

window.electronAPI.onMenuSaveAs(handleProjectSaveAs);

window.electronAPI.onMenuLoadProject(handleProjectLoad);

window.electronAPI.onRunTestFunction(() => {
  testFunction();
})

window.electronAPI.onRunTestFunction2(() => {

})

window.electronAPI.on




async function testFunction(){

  console.log(store.state.sequences.byID)
}



async function handleProjectLoad(){
  const filePath = await window.electronAPI.openProjectDialog();
    if (!filePath) {
      console.log("User Cancelled")
      return; // user cancelled
    }
    store.actions.loadProject(filePath);
    
}


async function handleProjectSaveAs(){
  const filePath = await window.electronAPI.saveProjectAsDialog();
  if(!filePath){
    console.log("User Cancelled")
    return;
  }
  store.actions.saveProjectAs(filePath);
}


store.actions.createNewProject("Untitled")
store.actions.updateSongSpaceFromState();

//store.actions.dockWindow({id: store.state.windows.allIDs[0], dock: "left"})

//Tests
// store.actions.initiateSong({songDSL: song})
// store.actions.getSongDescription({})
// store.actions.updateSongSpaceFromState({});
// const projectData = store.domain.app.serializeProject(store.state)
// const validationErrors = store.domain.app.validateProjectData(projectData)
// store.domain.app.saveProjectAs("C:\\Users\\Louis Selwood\\OneDrive\\Documents\\University Work\\Dissertation\\SaveTests", store.state);

