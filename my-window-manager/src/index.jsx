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
  testFunction3();
  
})

async function testFunction3(){
  store.actions.copySectionAtEnd(store.state.sections.allIDs[0])
  console.log(store.state.sections.byID)
}
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

async function testFunction2(){
  console.log("Sending for Results")
  const format = `
You are a concise music theory assistant. Output ONLY one JSON array. No extra text.

Task
Given a chord progression and its key, compute each chord's scale degree and function.

Required output schema
{"chord":"string","reason":"<=12 words","theory":"I|ii|iii|IV|V|vi|vii°|V/target|borrowed iv|bVI|V7|I6|other"}

Rules
- Compute scale_degree from the given key; do not guess.
- Use canonical mapping for the key. For C major use: C:I, Dm:ii, Em:iii, F:IV, G:V, Am:vi, Bdim:vii°.
- Label secondary dominants as V/target and borrowed chords explicitly.
- When referencing borrowed chords, specifically reference which key it is borrowed from by researching music theory
- Keep reason factual and <=12 words.
- Output exactly one JSON array with one object per chord. No extra fields.

Few-shot examples
[
  {"chord":"C","reason":"Tonic establishing the key.","theory":"I"},
  {"chord":"E7","reason":"Secondary dominant resolving to vi.","theory":"V/vi"}
]

Now analyse:
`
  
  const chordString = "Chord Progression: {C (I), Am (vi), Fm (borrowed iv), G7 (V7)}  \n Key: {C major}"
  const result = await fetch("http://localhost:8000/explain?chords=" + encodeURIComponent(format + chordString));
  const data = await result.json();
  console.log(data.explanation)
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
console.log(store.state.project.currentProject)
store.actions.updateSongSpaceFromState();

//store.actions.dockWindow({id: store.state.windows.allIDs[0], dock: "left"})

//Tests
// store.actions.initiateSong({songDSL: song})
// store.actions.getSongDescription({})
// store.actions.updateSongSpaceFromState({});
// const projectData = store.domain.app.serializeProject(store.state)
// const validationErrors = store.domain.app.validateProjectData(projectData)
// store.domain.app.saveProjectAs("C:\\Users\\Louis Selwood\\OneDrive\\Documents\\University Work\\Dissertation\\SaveTests", store.state);

