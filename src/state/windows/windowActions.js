//calls the domain logic for move window
export const moveWindow = (id, delta) => (state, domain) => {
    domain.windows.moveWindow(state, id, delta);
}

//calls the domain logic for resize window
export const resizeWindow = (id, delta) => (state, domain) => {
    domain.windows.resizeWindow(state, id, delta);
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

    }
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

    var dx = 0;
    var dy = 0;
    if(drag.axis === "x") {
        dx = mouseX - drag.startMouseX;
    } else if(drag.axis === "y") {
    dy = mouseY - drag.startMouseY;
    } else{
        dx = mouseX - drag.startMouseX;
        dy = mouseY - drag.startMouseY;
    }
    actions.resizeWindow(drag.id, {x: dx, y: dy})
}

//ends and resets drag for move
export const endDragMove = () => (state) => {
    state.windows.drag = null;
}
export const endDragResize = () => (state) => {
    state.windows.resizeDrag = null;
}

export const maximiseWindow = (id) => (state, domain) => {
    //domain logic goes in here
}
export const minimiseWindow = (id) => (state, domain) => {
    state.windows.byID[id].minimised = true;
}

export const focusWindow = (id) => (state, domain) => {
    //reset all windows to unfocused
    for (const key in state.windows.byID) {
        state.windows.byID[key].focused = false;
    }

    state.windows.byID[id].focused = true;   //set current window to focused

    //push window to front of order
    const ordIndex = state.windows.order.indexOf(id);
    if(ordIndex !== -1) state.windows.order.splice(ordIndex, 1);
    state.windows.order.push(id);
}

export const openWindow = (type) => (state, domain) => {
    //generates unique ID
    const id = domain.windows.generateID();

    //adds window properties to byID
    state.windows.byID[id] = {
        id,
        type,
        x: 100,
        y: 100,
        width: 400,
        height: 300,
        focused: true,
        minimised: false,
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