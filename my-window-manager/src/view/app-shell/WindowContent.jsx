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

  function dockWindow(){
    if(!store.actions){
      window.electronAPI.closePopout(id);
    }
    dispatchAction("dockWindow", {id, dock: "left"})
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
        onMouseDown={dockWindow}>
      </div>
      {store.state.windows.byID[id].state}
    </div>
  );
} 