import {useState, useEffect} from "react"
export function BottomDock({ store }) {


  const [dock, setDock] = useState(store.getState().windows.docks.bottom);
    useEffect(() => {
        const unsub = store.subscribe(() => {
            setDock(store.getState().windows.docks.bottom);
        })
        return unsub;
    },[store])

    const dockStyle = {
        width: "100%", 
        height: dock.size, 
        marginBottom: "auto", 
        background: "green"
    }

    function handleMouseDown(e){
        const onEdge = detectEdge(e);

        if(onEdge){
            startResize(e);
        }
    }

    function startResize(e){
        const startY = e.clientY;

        store.actions.startDockDrag("bottom", startY);
        console.log(store.state.windows.dockDrag)
        //updates drag
        function handleMove(e){
            console.log(dock.size)
            store.actions.dragDockResize(e.clientY);
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
        const y = e.clientY - rect.top;

        const edgeSize = 8; // px from edge counts as “edge”

        return (y < edgeSize);
    }
    return (
    Object.keys(store.state.windows.docks.bottom.contentIDs).length !== 0 && (
        <div 
            style={dockStyle}
            onMouseDown={handleMouseDown}>
            bottom
        </div>
    )
    );
}