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

//Listens for file I/O Events.
window.electronAPI.onMenuSaveProject(() => {
  store.actions.saveProject();
});

window.electronAPI.onMenuSaveAs(handleProjectSaveAs);

window.electronAPI.onMenuLoadProject(handleProjectLoad);

window.electronAPI.onRunTestFunction(() => {
  testFunction();
  
})

async function testFunction(){

  const Verse = store.state.project.currentProject.songContents[2]
  console.log(Verse)
  const VerseSequences = store.state.sections.byID[Verse].sequenceIDs
  console.log(VerseSequences)
  let chords = []
  VerseSequences.forEach(sequenceID => {
    const sequence = store.state.sequences.byID[sequenceID]
    chords.push(...sequence.chordIDs)
  })

  const data = await store.domain.primary.getSequenceSuggestions(store.state, chords)
  console.log(data);
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


store.actions.openWindow("Chord Workshop");
store.actions.openWindow("Song Editor");
store.actions.openWindow("Settings");
store.actions.createNewProject("Untitled")

//store.actions.dockWindow({id: store.state.windows.allIDs[0], dock: "left"})

//Tests
// store.actions.initiateSong({songDSL: song})
// store.actions.getSongDescription({})
// store.actions.updateSongSpaceFromState({});
// const projectData = store.domain.app.serializeProject(store.state)
// const validationErrors = store.domain.app.validateProjectData(projectData)
// store.domain.app.saveProjectAs("C:\\Users\\Louis Selwood\\OneDrive\\Documents\\University Work\\Dissertation\\SaveTests", store.state);

