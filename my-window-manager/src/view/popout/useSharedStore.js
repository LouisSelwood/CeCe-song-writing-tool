import { useEffect, useState } from "react";

export function useSharedStore() {
  const [state, setState] = useState(null);

  useEffect(() => {

    //gets the initial state from the global store
    window.api.getState().then((initial) => {
      setState(initial);
    });

    //Subscriber: recieves IPC event "store:update" from electron.js through API and updates sharedState
    window.api.onStateUpdate((newState) => {
      setState(newState);
    });

  }, []);

  //Publisher: calls API function that publishes action with topic "store:dispatch"
  function dispatch(action, payload) {
    window.api.dispatch(action, payload);
  }

  return { state, dispatch }; //returns shared store
}