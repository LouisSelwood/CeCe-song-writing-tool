export function transition(state, id, event) {
    const win = {...state.windows.byID[id]};
    switch (win.state) {
        case "normal":
            if (event === "START_MOVE") win.state = "moving";
            if (event === "START_RESIZE") win.state = "resizing";
            if (event === "MAXIMISE") win.state = "maximised";
            if (event === "DOCK") win.state = "docked";
            if (event === "POP_OUT") win.state = "popped"
            break;

        case "moving":
            if (event === "STOP") win.state = "normal";
            if (event === "DOCK") win.state = "docked";
            break;

        case "resizing":
            if (event === "STOP") win.state = "normal";
            break;

        case "docked":
            if (event === "START_UNDOCK_DRAG") win.state = "undocking";
            break;

        case "undocking":
            if(event === "STOP") win.state = "docked";
            if (event === "UNDOCKED") win.state = "moving";
            break;

        case "maximised":
            if (event === "RESTORE") win.state = "normal";
            break;

        case "popped":
            if (event === "POP_IN") win.state = "normal";
    }
    state.windows.byID[id] = win;
}

export function generateID() {
    return "win_" + Math.random().toString(36).slice(2);
}

export function moveWindow(state, id, delta) {
    const win = {...state.windows.byID[id]};
    win.x = state.windows.drag.startWinX + delta.x;
    win.y = Math.max(0,state.windows.drag.startWinY + delta.y);
    state.windows.byID[id] = win;

}

export function resizeWindow(state, id, delta) {
    const win = {...state.windows.byID[id]}
    const minusX = ['nw','w','sw']
    const minusY= ['nw','n','ne']
    if(minusX.includes(state.windows.drag.axis)){
        win.width = state.windows.drag.startWidth - delta.x;
        win.x = state.windows.drag.startWinX + delta.x;
    }else{
        win.width = state.windows.drag.startWidth + delta.x;
    }

    if(minusY.includes(state.windows.drag.axis)){
        win.height = state.windows.drag.startHeight - delta.y;
        win.y = state.windows.drag.startWinY + delta.y;
    }else{
        win.height = state.windows.drag.startHeight + delta.y;
    }
    state.windows.byID[id] = win;
}

export function resizeDock(state, dock, delta) {
    const newDock = {...state.windows.docks[dock]};
    if(dock === "left"){
        newDock.size = Math.max(40,state.windows.drag.startSize + delta);
    }
    else if(dock === "right"){
        newDock.size = Math.max(40,state.windows.drag.startSize - delta);
    }
    else if(dock === "bottom"){
        newDock.size = Math.max(40,state.windows.drag.startSize - delta);
    }
    state.windows.docks[dock] = newDock;
    console.log(`size: ${state.windows.docks[dock].size}     delta: ${delta}`)
}

export function shouldUndock(distance) {
    return distance > 60;
}

export function focusWindow(state, id) {
    // Reset all to unfocused
    for (const key in state.windows.byID) {
        state.windows.byID[key].focused = false;
    }
    // Focus target
    state.windows.byID[id].focused = true;
    // Reorder
    const idx = state.windows.order.indexOf(id);
    if(idx !== -1) state.windows.order.splice(idx, 1);
    state.windows.order.push(id);
}

export function validateWindowPatch(currentWindow, patch) {
    // Domain enforces what can be updated
    const allowed = ["x", "y", "width", "height", "focused"];
    for (const key of Object.keys(patch)) {
        if (!allowed.includes(key)) throw new Error(`Cannot update ${key}`);
    }
    return true;
}
