import "./css/WindowContent.css";
export function WindowContent({ store, id }) {
  if (!store.state) {
    return null; // or a loading spinner
  }

  function unPopout() {
    if(store.state.windows.byID[id].poppedOut){
      console.log("UnPopped")
      dispatch({poppedOut: false})
      window.electronAPI.closePopout(id);
    }
  }


  function dispatch(patch){
    if(!!store.actions){
      Object.assign(store.state.windows.byID[id], patch);
    }else{
      console.log("Popout State: ", store.state.windows.byID[id])
      store.dispatch("updateWindow", {id, patch});
    }
  }

  return (
    <div className="window-content">
      <div 
        style={{width: 60, height: 60, alignSelf: "center",justifySelf: "space-between", color: "white",fontSize: 12, display: "flex", backgroundColor: "#2b5f3b", borderColor: "black", borderWidth: 4, borderRadius: 6}}
        onMouseDown={unPopout}>
      </div>
      {store.state.windows.byID[id].type}
    </div>
  );
}