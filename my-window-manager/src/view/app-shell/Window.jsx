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

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setWin(store.getState().windows.byID[id]);
    });
    return unsub;
  }, [store, id]);

  const windowStyle = {
    position: "absolute",
    left: win.maximised ? 0 : win.x,
    top: win.maximised ? 0 : win.y,
    width: win.maximised ? window.innerWidth : win.width,
    height: win.maximised ? window.innerHeight: win.height,
    backgroundColor: "#383838",
    borderRadius: 12,
    overflow: "hidden",
    cursor: cursor,
  };

  const windowTabStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: store.state.windows.titleBarHeight,
    backgroundColor: "#101010",
    borderBottom: "1px solid #333",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "white",
    userSelect: "none",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    boxSizing: "border-box",
    overflow: "hidden"
  };

  function handleMouseMove(e){
    const edges = detectEdge(e);
    const axis = getEdge(edges);
    console.log(cursor)
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
    if(action === "minimise"){
      store.actions.minimiseWindow(id)
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
    !win.minimised && (


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
          <div style={{ color: "white", fontSize: 20 }}>
            {win.type}
          </div>
          <div style={{display: "flex", alignSelf: "flex-end", height: "100%", gap: 2, marginLeft: "auto"}}>
            <div 
              data-action="minimise"
              style={{backgroundColor: "#6a6a6a59", width: 32, height: "100%"}}
            />
            <div 
              data-action="maximise"
              style={{backgroundColor: "#6a6a6a59", width: 32, height: "100%"}}
            />
            <div 
              data-action="close"
            style={{backgroundColor: "#6a6a6a59", width: 32, height: "100%"}}
            />
          </div>

        </div>

        <div className="content">
          {/* render window content here */}
        </div>
      </div>
    )
  );
}