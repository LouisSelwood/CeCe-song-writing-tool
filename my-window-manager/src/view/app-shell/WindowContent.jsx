import "./css/WindowContent.css";
export function WindowContent({ store, id }) {
  function unPopout() {
    if(store.state.windows.byID[id].poppedOut){
      console.log("UnPopped")
      dispatch({poppedOut: false})
      window.electronAPI.closePopout(id);
    }
  }
  function testState(){

    dispatch({type: "Emily is Sweet"})
  }

  function dispatch(patch){
    if(!!store.actions){
      Object.assign(store.state.windows.byID[id], patch);
    }else{
      store.dispatch("updateWindow", {id, patch});
    }
  }

  return (
    <div className="window-content">
      <div 
        style={{width: 60, height: 60, alignSelf: "center",justifySelf: "space-between", color: "white",fontSize: 12, display: "flex", backgroundColor: "indigo"}}
        onMouseDown={unPopout}>
        
      </div>
      <div 
        style={{width: 60, height: 60, alignSelf: "center",justifySelf: "space-between", color: "white",fontSize: 12, display: "flex", backgroundColor: "blue"}}
        onMouseDown={testState}>
        
      </div>
    </div>
  );
}