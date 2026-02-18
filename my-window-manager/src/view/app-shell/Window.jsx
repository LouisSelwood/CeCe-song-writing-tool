import "./css/Window.css";
import "./css/WindowContent.css";
import { WindowContent } from "./WindowContent.jsx";
import { useState, useEffect } from "react";


export function Window({ store, id }) {
  const [win, setWin] = useState(store.getState().windows.byID[id]);
  const [cursor, setCursor] = useState("default");
  const cursorMap = {
    n: "ns-resize",
    s: "ns-resize",
    e: "ew-resize",
    w: "ew-resize",
    ne: "nesw-resize",
    sw: "nesw-resize",
    nw: "nwse-resize",
    se: "nwse-resize",
    none: "default"
  };
  const [buttonHover, setButtonHover] = useState({"close": false, "popout": false, "maximise": false})

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setWin(store.getState().windows.byID[id]);
      console.log(win.type, ": ", win.poppedOut);
    });
    return unsub;
  }, [store, id]);

  const windowStyle = {
    position: "absolute",
    borderBottom: "1px solid #3e3e3e",
    left: win.maximised ? 0 : win.x,
    top: win.maximised ? 0 : win.y,
    width: win.maximised ? window.innerWidth : win.width,
    height: win.maximised ? window.innerHeight: win.height,
    backgroundColor: "#383838",
    borderRadius: 6,
    overflow: "hidden",
    cursor: cursor,
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.45)"
  };

  const windowTabStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: store.state.windows.titleBarHeight,
    backgroundColor: "#202020",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "white",
    userSelect: "none",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    boxSizing: "border-box",
    overflow: "hidden",


  };

  function handleMouseMove(e){

    const action = e.target.dataset.action;
    if (action) {
      setCursor("default");
      setButtonHover({
        close: action === "close",
        popout: action === "popout",
        maximise: action === "maximise"
      });
      return;
    }else{
      setButtonHover({
        close: false,
        popout: false,
        maximise: false
      });
    }

    const edges = detectEdge(e);
    const axis = getEdge(edges);

    if(axis !== "none"){
      setCursor(cursorMap[axis])
      
    }
    else if(detectBar(e)){
      setCursor("grab");
    }
    else{
      setCursor("default")
    }

  }

  function handleButtonClick(action, id){
    if(action === "close"){
      store.actions.closeWindow(id);
    }
    if(action === "maximise"){
      store.actions.maximiseWindow(id)
    }
    if(action === "popout"){
      store.actions.popoutWindow(id)
      window.api.popoutWindow(win)
    }
  }

  function handleMouseDown(e) {
    const action = e.target.dataset.action;
    if (action) {
      handleButtonClick(action, id);
      return;
    }

    store.actions.focusWindow(id)
    const edges = detectEdge(e)
    const axis = getEdge(edges)
    if(axis !== "none") {
      startResize(axis, e);
      return;
    }

    if(detectBar(e)){
      store.actions.unmaximiseWindow(id, e.clientX, e.clientY, window.innerWidth)
      startMove(e);
    }

  }
  function startResize(axis, e){
    const startX = e.clientX;
    const startY = e.clientY;
    store.actions.startDragResize(id, axis, startX, startY)

    function handleMove(e){
      store.actions.dragWindowResize(e.clientX, e.clientY);
    }
    function handleUp(){
      store.actions.endDragResize();
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    }
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }

  function startMove(e){
    const startX = e.clientX;
    const startY = e.clientY;
    store.actions.startDragMove(win.id, startX, startY);

    function handleMove(e) {
      store.actions.dragWindowMove(e.clientX, e.clientY);
    }

    function handleUp() {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      store.actions.endDragMove();
    }
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }
  

  function detectEdge(e){
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const edgeSize = 8; // px from edge counts as “edge”

    return  {
      onTop: y < edgeSize,
      onBottom: y > rect.height - edgeSize,
      onLeft: x < edgeSize,
      onRight: x > rect.width - edgeSize
    
    }
  }

  function getEdge(edges){
    let dir = "";
    if (edges.onTop)    dir += "n";
    if (edges.onBottom) dir += "s";
    if (edges.onLeft)   dir += "w";
    if (edges.onRight)  dir += "e";
    if(dir === ""){
      dir = "none"
    }
    return dir;

  }
  function detectBar(e){
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;

    if(y < store.state.windows.titleBarHeight){
      return true;
    }else{
      return false;
    }
  }

  return (
    !win.poppedOut && (


      <div
        className="window"
        style={windowStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <div 
          className="title-bar"
          style = {windowTabStyle}
        >
          <div style={{ 
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "white",
            fontSize: 12,
          }}>
            <img src="/assets/Music.png" style={{ width: 14, height: 14 }} />
            {win.type}
          </div>

          <div style={{display: "flex", alignSelf: "flex-end", height: "100%", marginLeft: "auto"}}>
            <div 
              data-action="popout"
              style={{backgroundColor: buttonHover["popout"] ? "#85858559": "#6a6a6a59", width: 49, height: "100%", justifyContent: 'center', alignItems: 'center'}}
            />
            <div 
              data-action="maximise"
              style={{backgroundColor: buttonHover["maximise"] ? "#85858559": "#6a6a6a59", width: 48, height: "100%", justifyContent: 'center', alignItems: 'center'}}
            />
            <div 
              data-action="close"
            style={{backgroundColor: buttonHover["close"] ? "#f8121259": "#6a6a6a59", width: 48, height: "100%", justifyContent: 'center', alignItems: 'center'}}
            />
          </div>

        </div>

        <div className="window-content">
          <WindowContent store={store} id={id}/>
        </div>
      </div>
    )
  );
}