// Holds the state of all windows in the application.
export const windowInitialState = {
    order: [],
    byID: {},
    allIDs: [],
    mousePos: null,
    focusedWindowID: null,
    drag: null,
    titleBarHeight: 30,
    projectBarHeight: 60,
    docks: {
        left: {size: 200, contentIDs: [], focusedID: null},
        right: {size: 200, contentIDs: [], focusedID: null},
        bottom: {size: 200, contentIDs: [], focusedID: null}
        
    }
}