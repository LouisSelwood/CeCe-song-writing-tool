//exports info about window state
export const selectWindowsByID = (state, id) => state.windows.byID[id];
export const selectAllWindows = (state) => state.windows.allIDs.map(id => state.windows.byID[id]);
export const selectFocusedWindowID = (state) => state.windows.focusedWindowID;
