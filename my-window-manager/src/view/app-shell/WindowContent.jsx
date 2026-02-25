import "./css/WindowContent.css";
export function WindowContent({ store, id }) {

  if (!store.state) {
    return null; // or a loading spinner
  }

  function unPopout() {
    if(store.state.windows.byID[id].state === "popped"){
      dispatchAction("popinWindow", {id});
    }
  }

  function testerButton(){

    dispatchAction("createLooseChord", {params: {root: "G", quality: "maj", extensions: ["11"]}})
    dispatchAction("createLooseChord", {params: {root: "E", quality: "min", extensions: []}})
    dispatchAction("createLooseChord", {params: {root: "C", quality: "maj", extensions: ["9"]}})
    dispatchAction("createLooseChord", {params: {root: "D", quality: "maj", extensions: []}})
    dispatchAction("createFullLooseSequence", {chordIDs: store.state.chords.allIDs})
    dispatchAction("createFullLooseSequence", {chordIDs: [store.state.chords.allIDs[2],store.state.chords.allIDs[3]]})
    dispatchAction("createEmptySection", {type: "Intro"})
    console.log(store.state.sections.byID);
    console.log(store.state.chords.byID);
    
  }

  function testerButton2(){
    console.log(store.state.sections.allIDs[0])
    dispatchAction("duplicateSequence", {sequenceID: store.state.sequences.allIDs[0]})
    dispatchAction("duplicateSequence", {sequenceID: store.state.sequences.allIDs[1]})
    dispatchAction("duplicateSequence", {sequenceID: store.state.sequences.allIDs[1]})
    dispatchAction("addSequence", {sectionID: store.state.sections.allIDs[0], sequenceID: store.state.sequences.allIDs[0]})
    dispatchAction("addSequence", {sectionID: store.state.sections.allIDs[0], sequenceID: store.state.sequences.allIDs[2]})
    dispatchAction("addSequence", {sectionID: store.state.sections.allIDs[0], sequenceID: store.state.sequences.allIDs[1]})
    dispatchAction("addSequence", {sectionID: store.state.sections.allIDs[0], sequenceID: store.state.sequences.allIDs[1]})
    console.log(Object.values(store.state.sections.byID))
    console.log(Object.values(store.state.sequences.byID))
    console.log(Object.values(store.state.chords.byID))
  }

  function testerButton3(){
    dispatchAction("duplicateSection", {sectionID: store.state.sections.allIDs[0]})
    dispatchAction("gatherChords", {})
  }

  function dispatchWindow(patch){
    dispatchAction("updateWindow", {id, patch});
  }
  function dispatchAction(action, payload) {
    if(!!store.actions){
      store.actions[action](payload);
    }else{
      store.dispatch(action, payload)
    }
  }

  return (
    <div className="window-content">
      <div 
        style={{width: 60, height: 60, alignSelf: "center",justifySelf: "space-between", color: "white",fontSize: 12, display: "flex", backgroundColor: "#2b5f3b", borderColor: "black", borderWidth: 4, borderRadius: 6}}
        onMouseDown={unPopout}>
      </div>
      <div 
        style={{width: 60, height: 60, alignSelf: "center",justifySelf: "space-between", color: "white",fontSize: 12, display: "flex", backgroundColor: "#2b5f3b", borderColor: "black", borderWidth: 4, borderRadius: 6}}
        onMouseDown={testerButton}>
      </div>
      <div 
        style={{width: 60, height: 60, alignSelf: "center",justifySelf: "space-between", color: "white",fontSize: 12, display: "flex", backgroundColor: "#2b5f3b", borderColor: "black", borderWidth: 4, borderRadius: 6}}
        onMouseDown={testerButton2}>
      </div>
      <div 
        style={{width: 60, height: 60, alignSelf: "center",justifySelf: "space-between", color: "white",fontSize: 12, display: "flex", backgroundColor: "#2b5f3b", borderColor: "black", borderWidth: 4, borderRadius: 6}}
        onMouseDown={testerButton3}>
      </div>
      {store.state.windows.byID[id].state}
    </div>
  );
} 