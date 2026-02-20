export function generateID() {
    return "win_" + Math.random().toString(36).slice(2);
}

export function moveWindow(state, id, delta) {
    const win = {...state.windows.byID[id]};
    win.x = Math.max(0,state.windows.drag.startWinX + delta.x);
    win.y = Math.max(0,state.windows.drag.startWinY + delta.y);
    state.windows.byID[id] = win;

}

export function resizeWindow(state, id, delta) {
    const win = state.windows.byID[id];
    const minusX = ['nw','w','sw']
    const minusY= ['nw','n','ne']
    if(minusX.includes(state.windows.resizeDrag.axis)){
        win.width = state.windows.resizeDrag.startWidth - delta.x;
        win.x = state.windows.resizeDrag.startWinX + delta.x;
    }else{
        win.width = state.windows.resizeDrag.startWidth + delta.x;
    }

    if(minusY.includes(state.windows.resizeDrag.axis)){
        win.height = state.windows.resizeDrag.startHeight - delta.y;
        win.y = state.windows.resizeDrag.startWinY + delta.y;
    }else{
        win.height = state.windows.resizeDrag.startHeight + delta.y;
    }
}

export function resizeDock(state, dock, delta) {
    const newDock = {...state.windows.docks[dock]};
    if(dock === "left"){
        newDock.size = Math.max(40,state.windows.dockDrag.startSize + delta);
    }
    else if(dock === "right" || dock === "bottom"){
        newDock.size = Math.max(40,state.windows.dockDrag.startSize - delta);
    }
    state.windows.docks[dock] = newDock;
    console.log(`size: ${state.windows.docks[dock].size}     delta: ${delta}`)
}

