import {testStore} from "./storetest.js";
import {store} from "../src/state/store/index.js";

//initialised test store with fake domain

store.actions.openWindow("ChordEditor");
store.actions.openWindow("SideBar");
store.actions.openWindow("Settings");

//===OPEN/CLOSE WINDOW TEST===//
    // console.log(`byID: ${Object.keys(store.state.windows.byID).length}`);
    // console.log(`allID: ${store.state.windows.allIDs.length}`);
    // console.log(`order: ${store.state.windows.order.length}`);
    // console.log("===CLOSES WINDOW===");
    // store.actions.closeWindow(store.state.windows.allIDs[0]);
    // console.log(`byID: ${Object.keys(store.state.windows.byID).length}`);
    // console.log(`allID: ${store.state.windows.allIDs.length}`);
    // console.log(`order: ${store.state.windows.order.length}`);

//===FOCUSWINDOWTEST===//
    // console.log("===INITIAL WINDOWS===");
    // console.log(store.state.windows.byID);

    // store.actions.focusWindow(store.state.windows.allIDs[2]);
    // console.log("===FOCUS THIRD WINDOW===");
    // console.log(store.state.windows.byID);

    // store.actions.focusWindow(store.state.windows.allIDs[0]);
    // console.log("===FOCUS FIRST WINDOW===");
    // console.log(store.state.windows.byID);

//===WINDOW DRAG TEST===//
    // const focusedWindowID = store.state.windows.allIDs[0];
    // console.log("===INITIAL WINDOW POSITION===");
    // console.log(store.state.windows.byID[focusedWindowID]);

    // console.log("===DRAG OBJECT CREATED===");
    // store.actions.startDragMove(focusedWindowID, 100, 100);
    // console.log(store.state.windows.drag);

    // console.log("===DRAG WINDOW TEST 1===");
    // store.actions.dragWindowMove(400, 500);
    // console.log(store.state.windows.byID[focusedWindowID]);

    // console.log("===DRAG WINDOW TEST 2===");
    // store.actions.dragWindowMove(345, 50);
    // console.log(store.state.windows.byID[focusedWindowID]);

    // console.log("===END DRAG===")
    // store.actions.endDragMove();
    // console.log(store.state.windows.drag);

//===WINDOW RESIZE TEST===///
    // const focusedWindowID = store.state.windows.allIDs[0];
    // console.log("===CREATE RESIZE DRAG X+Y===");
    // store.actions.startDragResize(focusedWindowID, "nw", 100, 100);
    // console.log(store.state.windows.resizeDrag);

    // console.log("===RESIZE DOWN RIGHT===");
    // store.actions.dragWindowResize(200, 200);
    // console.log(store.state.windows.byID[focusedWindowID]);

    // console.log("===RESIZE UP LEFT===");
    // store.actions.dragWindowResize(0, 0);
    // console.log(store.state.windows.byID[focusedWindowID]);