import {useState, useEffect} from "react";
export function LeftDock({ store }) {
    const [dock, setDock] = useState(store.getState().windows.docks.left);
    useEffect(() => {
        const unsub = store.subscribe(() => {
            setDock(store.getState().windows.docks.left);
        })
        return unsub;
    },[store])

    const dockStyle = {
        width: dock.size, 
        height: "100%", 
        background: "red",
    }

    function handleMouseDown(e){
        const onEdge = detectEdge(e);

        if(onEdge){
            startResize(e);
        }
    }

    function startResize(e){
        const startX = e.clientX;

        store.actions.startDockDrag("left", startX);
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

        return (x > rect.width - edgeSize);
    }

    return (
    Object.keys(dock.contentIDs).length !== 0 && (
        <div 
            style={dockStyle}
            onMouseDown={handleMouseDown}>
            left
        </div>
    )
    );
}