//calls the domain logic for move window
export const moveWindow = (id, delta) => (state, domain) => {
    const newWin = domain.windows.moveWindow(state, id, delta);
    state.windows.byID[id] = newWin;
}

//calls the domain logic for resize window
export const resizeWindow = (id, delta) => (state, domain) => {
    const newWin = domain.windows.resizeWindow(state, id, delta);
    state.windows.byID[id] = newWin;
}

export const resizeDock = (dock, delta) => (state, domain) => {
    const newDock = domain.windows.resizeDock(state, dock, delta)
    state.windows.docks[dock] = newDock;
}

//START DRAG

export const startDragMove = (id, mouseX, mouseY) => (state, domain) => {
    domain.windows.transition(state, id, "START_MOVE");
    state.windows.drag = {
        id,
        startMouseX: mouseX,
        startMouseY: mouseY,
        startWinX: state.windows.byID[id].x,
        startWinY: state.windows.byID[id].y,
    }
}

export const startDragResize = (id, axis, mouseX, mouseY) => (state, domain) => {
    domain.windows.transition(state, id, "START_RESIZE");
    state.windows.drag = {
        id,
        axis,
        startMouseX: mouseX,
        startMouseY: mouseY,
        startWidth: state.windows.byID[id].width,
        startHeight: state.windows.byID[id].height,
        startWinX: state.windows.byID[id].x,
        startWinY: state.windows.byID[id].y,

    }
}

export const startDockDrag = (dock, mousePos) => (state) => {
    state.windows.drag = {
        dock,
        startMousePos: mousePos,
        startSize: state.windows.docks[dock].size,
    }
}

export const startUndockDrag = (id, dock, mouseX, mouseY) => (state,domain) => {
    domain.windows.transition(state, id, "START_UNDOCK_DRAG")
    state.windows.drag = {
        id,
        dock,
        startMouseX: mouseX,
        startMouseY: mouseY,
    }
}

export const undockDrag = (mouseX, mouseY) => (state, domain, actions) => {

    const drag = state.windows.drag;
    const dx = mouseX - drag.startMouseX;
    const dy = mouseY - drag.startMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if(domain.windows.shouldUndock(distance)){
        //initiates window undrag
        domain.windows.transition(state, drag.id, "UNDOCKED")
        actions.undockWindow(drag.id);
        actions.windowToMouse(drag.id);
        const { x, y } = state.windows.mousePos;
        actions.startDragMove(drag.id, x, y);
    }
}
export const dragDockResize = (mousePos) => (state, domain, actions) => {
    const drag = state.windows.drag;
    if(drag === null) return;
    const delta = mousePos - drag.startMousePos;
    actions.resizeDock(drag.dock, delta);
}

//UPDATE DRAG
export const dragWindowMove = (mouseX, mouseY) => (state, domain, actions) => {
    const drag = state.windows.drag;
    if(drag === null) return;

    const dx = mouseX - drag.startMouseX;
    const dy = mouseY - drag.startMouseY;
    actions.moveWindow(drag.id, { x: dx, y: dy })

}
export const dragWindowResize = (mouseX, mouseY) => (state, domain, actions) =>{
    const drag = state.windows.drag
    if(drag === null) return;


    const xAxis = ["ne","e","se","sw","w", "nw"]
    const yAxis = ["n","ne","se","s","sw","nw"]

    const dx = (xAxis.includes(drag.axis)) ?mouseX - drag.startMouseX :0
    const dy = (yAxis.includes(drag.axis)) ?mouseY - drag.startMouseY :0

    actions.resizeWindow(drag.id, {x: dx, y: dy})
}

//END DRAG
export const endDrag = (type) => (state, domain) => {
    if(type === "move" || type === "resize" || type === "undock"){
        domain.windows.transition(state, state.windows.drag.id, "STOP")
    }
    state.windows.drag = null;
}

//In React Window Actions
export const maximiseWindow = (id) => (state, domain) => {
    domain.windows.transition(state, id, "MAXIMISE")
}
export const unmaximiseWindow = (id, mouseX, mouseY, innerWidth) => (state, domain) =>{
    if(state.windows.byID[id].state === "maximised"){
        domain.windows.transition(state, id, "RESTORE")
        let win = {...state.windows.byID[id]}
        const mousePos = mouseX/innerWidth;
        win.x = Math.max(0,mouseX - (win.width * mousePos))
        win.y = Math.max(0,mouseY - state.windows.projectBarHeight - (state.windows.titleBarHeight/2))
        state.windows.byID[id] = win;
        
    }
}
export const popoutWindow = (id) => (state, domain) =>{
    domain.windows.transition(state, id, "POP_OUT");
}

export const popinWindow = ({id}) => (state,domain) => {
    domain.windows.transition(state, id, "POP_IN");
    window.electronAPI.closePopout(id);
}

export const focusWindow = (id) => (state, domain) => {
    const newWindows = domain.windows.focusWindow(state, id);
    state.windows = newWindows;
}

export const openWindow = (type) => (state, domain) => {
    //generates unique ID
    const id = domain.windows.generateID();

    //adds window properties to byID
    state.windows.byID[id] = {
        id,
        type,
        x: 0,
        y: 0,
        width: 600,
        height: 400,
        focused: true,
        dockedPos: "none",
        state: "normal"
    }

    //adds window to order and allIDs
    state.windows.allIDs.push(id);
    state.windows.order.push(id);
}
export const closeWindow = (id) => (state, domain) => {
    const docked = state.windows.byID[id].dockedPos
    if(docked !== "none"){
        const newDock = {...state.windows.docks[docked]}
        newDock.contentIDs = state.windows.docks[docked].contentIDs.filter(item => item !== id);
        newDock.focusedID = null
        state.windows.docks[docked] = newDock;
    }
    delete state.windows.byID[id]; //deletes window from dictionary

    //deletes window from allIDs
    const allIndex = state.windows.allIDs.indexOf(id);
    if (allIndex !== -1) state.windows.allIDs.splice(allIndex, 1);

    //deletes window from order
    const ordIndex = state.windows.order.indexOf(id);
    if (ordIndex !== -1) state.windows.order.splice(ordIndex, 1);

}


export const updateMousePos = ({width, height, x, y}) => (state) => {
    state.windows.mousePos = {
        width,
        height,
        x,
        y,
    }
}
export const windowToMouse = (id) => (state) => {
    let win = {...state.windows.byID[id]}
    win.x = state.windows.mousePos.x - 60;
    win.y = state.windows.mousePos.y - (state.windows.titleBarHeight*2.5);
    state.windows.byID[id] = win;
}

//Dock Specific Actions
export const switchDockWindow = (id, dock) => (state) => {
    let newDock = {...state.windows.docks[dock]}
    newDock.focusedID = id;
    state.windows.docks[dock] = newDock;
}
export const undockWindow = (id) => (state) => {
    let dock = {...state.windows.docks[state.windows.byID[id].dockedPos]};
    let win = {...state.windows.byID[id]};
    win.dockedPos = "none";
    dock.contentIDs = dock.contentIDs.filter(item => item !== id);
    dock.focusedID = null;
    state.windows.docks[state.windows.byID[id].dockedPos] = dock;
    state.windows.byID[id] = win;
}




//Below are actions called by the window content
//The params for these yneed to be dicts in order for internal and external windows to call them
export const updateWindow = ({ id, patch }) => (state, domain) => {
  domain.windows.validateWindowPatch(state.windows.byID[id], patch);
  Object.assign(state.windows.byID[id], patch);
};

export const dockWindow = ({id, dock}) => (state, domain) => {
    if(dock === "maximise"){
        domain.windows.transition(state, id, "MAXIMISE");
        return;
    }
    domain.windows.transition(state, id, "DOCK")
    const newDock = {...state.windows.docks[dock]}
    newDock.contentIDs.push(id);
    state.windows.docks[dock] = newDock;
    
    const newWin = {...state.windows.byID[id]}
    newWin.dockedPos = dock
    state.windows.byID[id] = newWin;
};

export const startChordWorkshop = () => (state, domain, actions) => {
    const currentChordWorkshop = Object.values(state.windows.byID).find(window => window.type === "Chord Workshop")
    if(currentChordWorkshop){
        actions.closeWindow(currentChordWorkshop.id);
    }
    actions.openWindow("Chord Workshop");
    const newChordWorkshop = Object.values(state.windows.byID).find(window => window.type === "Chord Workshop")
    actions.dockWindow({id: newChordWorkshop.id, dock: "bottom"})
    actions.switchDockWindow(newChordWorkshop.id, "bottom")
    state.windows.docks.bottom.size = 500;
    
}