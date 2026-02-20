import { useState, useEffect} from "react";
export function RightDock({ store }) {
    const [dock, setDock] = useState(store.getState().windows.docks.right);
    useEffect(() => {
        const unsub = store.subscribe(() => {
            setDock(store.getState().windows.docks.right);
        })
        return unsub;
    },[store])

  const dockStyle = {
    width: dock.size, 
    height: "100%", 
    background: "blue",
  }

  function handleMouseDown(e){
        const onEdge = detectEdge(e);

        if(onEdge){
            startResize(e);
        }
    }

    function startResize(e){
        const startX = e.clientX;

        store.actions.startDockDrag("right", startX);
        console.log(store.state.windows.dockDrag)
        //updates drag
        function handleMove(e){
            store.actions.dragDockResize(e.clientX);
        }
        //ends drag
        function handleUp(){
            store.actions.endDockResize();
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        }
        //adds listeners for the mouse
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        }

    //returns which window edges the mouse is touching 
    function detectEdge(e){
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const edgeSize = 8; // px from edge counts as “edge”

        return (x < edgeSize);
    }
  return (
    Object.keys(dock.contentIDs).length !== 0 && (
        <div 
            style={dockStyle}
            onMouseDown={handleMouseDown}>
            right
        </div>
    )
  );
}