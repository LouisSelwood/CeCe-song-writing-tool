export function generateID() {
    return "win_" + Math.random().toString(36).slice(2);
}

export function moveWindow(state, id, delta) {
    const win = state.windows.byID[id];
    win.x = state.windows.drag.startWinX + delta.x;
    win.y = state.windows.drag.startWinY + delta.y;
    
}
