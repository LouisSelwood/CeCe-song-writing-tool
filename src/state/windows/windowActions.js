export const moveWindow = (id, delta) => (state, domain) => {
    domain.windows.moveWindow(state, id, delta);
}

export const initialiseDrag = (id, mouseX, mouseY) => (state) => {
    state.windows.drag = {
        id,
        startMouseX: mouseX,
        startMouseY: mouseY,
        startWinX: state.windows.byID[id].x,
        startWinY: state.windows.byID[id].y,
    }
}

export const dragWindow = (mouseX, mouseY) => (state, domain, actions) => {
    const drag = state.windows.drag;
    if(drag === null) return;

    const dx = mouseX - drag.startMouseX;
    const dy = mouseY - drag.startMouseY;
    actions.moveWindow(drag.id, { x: dx, y: dy })

}

export const stopDrag = () => (state) => {
    state.windows.drag = {};
}
export const resizeWindow = (id, delta) => (state, domain) => {
    //domain logic goes in here
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