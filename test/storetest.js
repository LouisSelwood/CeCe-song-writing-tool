
export const testStore = (store) => {
    var successfulState = 0;
    var totalState = 0;
    for (const [sliceName, sliceState] of Object.entries(store.state)) {
        if (sliceState !== undefined && sliceState !== null) {
            successfulState += 1;
        }
        totalState += 1;

    }

    var successfulAction = 0;
    var totalAction = 0;
    //tests whether each action has been bounded properly and is accessable
    for (const [actionName, fn] of Object.entries(store.actions)) {
        if (typeof fn === "function") {
            successfulAction += 1;
        }
        totalAction += 1;
    }

    //display results
    console.log(`State Slice Loaded: ${successfulState} / ${totalState}`)
    console.log(`Actions Bound: ${successfulAction} / ${totalAction}`)
}


