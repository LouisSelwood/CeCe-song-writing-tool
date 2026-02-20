// Holds the state of all windows in the application.
export const windowInitialState = {
    order: [],
    byID: {},
    allIDs: [],
    focusedWindowID: null,
    drag: null,
    resizeDrag: null,
    dockDrag: null,
    titleBarHeight: 30,
    projectBarHeight: 60,
    docks: {
        left: {size: 200, contentIDs: ["3"]},
        right: {size: 200, contentIDs: ["3"]},
        bottom: {size: 200, contentIDs: ["3"]}
        
    }
}