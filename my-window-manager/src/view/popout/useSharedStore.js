import { useEffect, useState } from "react";

export function useSharedStore() {
  const [state, setState] = useState(null);

  useEffect(() => {
    console.log("Shared Store Updated");

    window.api.getState().then((initial) => {
      setState(initial);
    });

    window.api.onStateUpdate((newState) => {
      setState(newState);
    });

  }, []);

  // Log AFTER state updates
  useEffect(() => {
    console.log("State changed:", state);
  }, [state]);
  // 3. Dispatch actions back to main window
  function dispatch(action, payload) {
    window.api.dispatch(action, payload);
  }

  return { state, dispatch };
}