export function generateID() {
    return "win_" + Math.random().toString(36).slice(2);
}

export function moveWindow(state, id, delta) {
    const win = state.windows.byID[id];
    win.x = state.windows.drag.startWinX + delta.x;
    win.y = state.windows.drag.startWinY + delta.y; 
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
