//calls the domain logic for move window
export const moveWindow = (id, delta) => (state, domain) => {
    domain.windows.moveWindow(state, id, delta);
}

//calls the domain logic for resize window
export const resizeWindow = (id, delta) => (state, domain) => {
    domain.windows.resizeWindow(state, id, delta);
}

export const resizeDock = (dock, delta) => (state, domain) => {
    domain.windows.resizeDock(state, dock, delta)
}

//triggered when a drag is started
export const startDragMove = (id, mouseX, mouseY) => (state) => {
    state.windows.drag = {
        id,
        startMouseX: mouseX,
        startMouseY: mouseY,
        startWinX: state.windows.byID[id].x,
        startWinY: state.windows.byID[id].y,
    }
}
export const startDragResize = (id, axis, mouseX, mouseY) => (state, domain) => {
    state.windows.resizeDrag = {
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
    state.windows.dockDrag = {
        dock,
        startMousePos: mousePos,
        startSize: state.windows.docks[dock].size,
    }
}

export const dragDockResize = (mousePos) => (state, domain, actions) => {
    const drag = state.windows.dockDrag;
    if(drag === null) return;
    const delta = mousePos - drag.startMousePos;
    actions.resizeDock(drag.dock, delta);
}
//updates window position with mouse position
export const dragWindowMove = (mouseX, mouseY) => (state, domain, actions) => {
    const drag = state.windows.drag;
    if(drag === null) return;

    const dx = mouseX - drag.startMouseX;
    const dy = mouseY - drag.startMouseY;
    actions.moveWindow(drag.id, { x: dx, y: dy })

}
export const dragWindowResize = (mouseX, mouseY) => (state, domain, actions) =>{
    const drag = state.windows.resizeDrag
    if(drag === null) return;


    const xAxis = ["ne","e","se","sw","w", "nw"]
    const yAxis = ["n","ne","se","s","sw","nw"]

    const dx = (xAxis.includes(drag.axis)) ?mouseX - drag.startMouseX :0
    const dy = (yAxis.includes(drag.axis)) ?mouseY - drag.startMouseY :0

    actions.resizeWindow(drag.id, {x: dx, y: dy})
}

//ends and resets drag for move
export const endDragMove = () => (state) => {
    state.windows.drag = null;
}
export const endDragResize = () => (state) => {
    state.windows.resizeDrag = null;
}
export const endDockResize = () => (state) => {
    state.windows.dockDrag = null
}

export const maximiseWindow = (id) => (state, domain) => {
    let win = {...state.windows.byID[id]}
    win.maximised = true;
    state.windows.byID[id] = win;
}
export const unmaximiseWindow = (id, mouseX, mouseY, innerWidth) => (state, domain) =>{
    if(state.windows.byID[id].maximised){
        let win = {...state.windows.byID[id]}
        win.maximised = false;
        const mousePos = mouseX/innerWidth;
        win.x = Math.max(0,mouseX - (win.width * mousePos))
        win.y = Math.max(0,mouseY - state.windows.projectBarHeight - (state.windows.titleBarHeight/2))
        state.windows.byID[id] = win;
        
    }
}
export const popoutWindow = (id) => (state) =>{
    let win = {...state.windows.byID[id]};
    win.poppedOut = true;
    state.windows.byID[id] = win;
}

export const focusWindow = (id) => (state, domain) => {
    console.log(`${id} Clicked!`)

    //reset all windows to unfocused
    for (const key in state.windows.byID) {
        const currwin = {...state.windows.byID[key]}
        currwin.focused = false;
        state.windows.byID[key] = currwin;
    }

    //set current window to focused
    const currwin = {...state.windows.byID[id]}
    currwin.focused = true;
    state.windows.byID[id] = currwin;

    //push window to front of order
    const orderCopy = [...state.windows.order]
    const ordIndex = orderCopy.indexOf(id);
    if(ordIndex !== -1) orderCopy.splice(ordIndex, 1);
    orderCopy.push(id);
    state.windows.order = orderCopy;
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
        maximised: false,
        poppedOut: false,
        dockedPos: "none"
    }

    //adds window to order and allIDs
    state.windows.allIDs.push(id);
    state.windows.order.push(id);
}
export const closeWindow = (id) => (state, domain) => {
    
    delete state.windows.byID[id]; //deletes window from dictionary

    //deletes window from allIDs
    const allIndex = state.windows.allIDs.indexOf(id);
    if (allIndex !== -1) state.windows.allIDs.splice(allIndex, 1);

    //deletes window from order
    const ordIndex = state.windows.order.indexOf(id);
    if (ordIndex !== -1) state.windows.order.splice(ordIndex, 1);
}


export const updateWindow = ({ id, patch }) => (state) => {
  Object.assign(state.windows.byID[id], patch);
};
