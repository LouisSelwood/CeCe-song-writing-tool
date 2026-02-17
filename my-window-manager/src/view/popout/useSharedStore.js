import { useEffect, useState } from "react";

export function useSharedStore() {
  const [state, setState] = useState(null);

  useEffect(() => {
    console.log("Shared Store Updated")
    // 1. Get initial state from main window
    window.api.getState().then(setState);

    // 2. Listen for updates from main window
    window.api.onStateUpdate((newState) => {
      setState(newState);
    });
    console.log(`State After Update ${typeof state}`);
  }, [state]);

  // 3. Dispatch actions back to main window
  function dispatch(action, payload) {
    window.api.dispatch(action, payload);
  }

  return { state, dispatch };
}