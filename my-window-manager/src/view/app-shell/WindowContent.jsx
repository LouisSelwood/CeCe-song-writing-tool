import "./css/WindowContent.css";
import { ChordWorkshop } from "../windows/chord-workshop/ChordWorkshop";
import song from '../../../../test/TestSongs/dont-look-back-in-anger.json';

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
    dispatchAction("createNewProject", {name: "Dont Look Back In Anger"})
    dispatchAction("initiateSong", {songDSL: song})
    dispatchAction("getSongDescription", {});
    dispatchAction("updateSongSpaceFromState", {});
  }






  async function dispatchAction(action, payload) {
    // React window: store.actions exists → call main store directly
    if (store.actions) {
      store.actions[action](payload);
      return; // no need to wait, state updates synchronously
    }

    store.dispatch(action, payload)
  }


  return (

    <div style={{height: "100%", width: "100%"}}>
      {store.state.windows.byID[id].type === "Debug" && (
        <>
        <div 
          style={{width: 60, height: 60, alignSelf: "center",justifySelf: "space-between", color: "white",fontSize: 12, display: "flex", backgroundColor: "#2b5f3b", borderColor: "black", borderWidth: 4, borderRadius: 6}}
          onMouseDown={unPopout}>
        </div>
        <div 
          style={{width: 60, height: 60, alignSelf: "center",justifySelf: "space-between", color: "white",fontSize: 12, display: "flex", backgroundColor: "#2b5f3b", borderColor: "black", borderWidth: 4, borderRadius: 6}}
          onMouseDown={testerButton}>
        </div>
        </>
      )}

      {store.state.windows.byID[id].type === "Chord Workshop" && (
        <ChordWorkshop store={store}/>
      )}
    </div>
  );
} 