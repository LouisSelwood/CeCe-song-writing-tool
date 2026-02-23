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
    const win = state.windows.byID[id];
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

