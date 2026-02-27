import {useState, useEffect} from "react";
import {WindowContent} from "../WindowContent.jsx"
import "./dock.css";
export function RightDock({ store }) {
    
    //state update
    const [dock, setDock] = useState(store.getState().windows.docks.right);
    const [iconHover, setIconHover] = useState(Object.fromEntries(dock.contentIDs.map(id => [id, false])));
    const [buttonHover, setButtonHover] = useState({close: false, undock: false});
    useEffect(() => {
        const unsub = store.subscribe(() => {
            const newDock = store.getState().windows.docks.right;
            setDock(newDock);

        })
        return unsub;
    },[store])


    //handles mouse movement inside dock window
    function handleMouseMove(e){
        const action = e.target.dataset.action; 
        setIconHover(Object.fromEntries(dock.contentIDs.map(id => [id, false])))
        setButtonHover(
            Object.fromEntries(
                Object.keys(buttonHover).map(key => [key, false])
            )
        );
        if (action in iconHover) {
            setIconHover(prev => ({
                ...prev,
                [action]: true
            }));
            return;
        }
        if(action in buttonHover) {
            setButtonHover(prev => ({
                ...prev,
                [action]: true
            }));
            return;
        }
    }
    
    //handles mouse clicks inside dock window
    function handleMouseDown(e){
        const action = e.target.dataset.action;
        if (dock.contentIDs.includes(action)) {
            console.log("yipyip");
            handleIconSelect(e, action);
            return;
        }else if(Object.keys(buttonHover).includes(action)){
            handleButtonSelect(action);
        }
        
        const onEdge = detectEdge(e);

        if(onEdge && !action){
            startResize(e);
            return;
        }
    }

    //handles icon selection and dragging on icon bar
    function handleIconSelect(e, action){
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        store.actions.startUndockDrag(action, "right", mouseX, mouseY);

        function handleMove(e){
            if(store.state.windows.byID[action].dockedPos === "none"){
                store.actions.dragWindowMove(e.clientX, e.clientY)
            }else{ 
                store.actions.undockDrag(e.clientX, e.clientY)
            }
        }
        function handleUp(e) {
            if(store.state.windows.byID[action].dockedPos === "none"){
                store.actions.endDrag("move");
            }else{ 
                store.actions.endDrag("undock");
            }
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        }
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        store.actions.switchDockWindow(action, "right")
        
    }
    
    //handles tab button presses
    function handleButtonSelect(action){
        if(action === "close"){
            console.log("window close")
            store.actions.closeWindow(dock.focusedID);
        }
        if(action === "undock"){
            console.log("window undocked")
            store.actions.undockWindow(dock.focusedID);
        }
    }

    //initiates dock resize
    function startResize(e){
        const startX = e.clientX;

        store.actions.startDockDrag("right", startX);
        //updates drag
        function handleMove(e){
            store.actions.dragDockResize(e.clientX);
        }
        //ends drag
        function handleUp(){
            store.actions.endDrag("dockResize");
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
                className="dock-container"
                style={{width: dock.size}}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                <div className="icon-bar">
                    {dock.contentIDs.map((id, index) => (
                        <div
                            key={index}
                            className="icon-box"
                            data-action={id}
                            style={{background: iconHover[id] ? "black" : "gray"}}
                            draggable="false"
                        >
                            {store.state.windows.byID[id].type[0]}
                        </div>
                        ))}
                </div>
                <div className="content-container">
                    {dock.focusedID !== null && (
                        <div className="wrapper">
                            <div className="dock-title-bar">
                                {store.state.windows.byID[dock.focusedID].type}
                                <div style={{display: "flex", alignSelf: "flex-end", height: "100%", marginLeft: "auto"}}>
                                    <div 
                                        data-action="undock"
                                        style={{backgroundColor: buttonHover.undock ? "#85858559": "#6a6a6a59", width: 32, height: "100%", justifyContent: 'center', alignItems: 'center'}}
                                    />
                                    <div 
                                        data-action="close"
                                        style={{backgroundColor: buttonHover.close ? "#f8121259": "#6a6a6a59", width: 32, height: "100%", justifyContent: 'center', alignItems: 'center'}}
                                    />
                                </div>
                            </div>
                            <WindowContent store={store} id={dock.focusedID}/>
                        </div>
                    )}
                </div>
            </div>
        )
    );
}