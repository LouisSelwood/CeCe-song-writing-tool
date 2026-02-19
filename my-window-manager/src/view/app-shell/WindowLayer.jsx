import "./css/WindowLayer.css";
import { Window } from "./Window.jsx";
import { useState, useEffect } from "react";
/**
 * Wrapper for all moveable window components
 * Renders all windows in z order
 */
export function WindowLayer({ store }) {
  const [windows, setWindows] = useState(store.state.windows);
  //Updates reacts render when the store mutates to ensure the view is in sync with the store
  useEffect(() => {
    const unsub = store.subscribe(() => {
      const next = store.state.windows;
      //Forces react to rerender as react does not register mutations, only assignments
      setWindows({
        ...next,
        order: [...next.order],
        byID: { ...next.byID },
      });
    });
    return unsub;
  }, [store]);


  return (
    <div className="window-layer">
      {windows.order.map((id, index) => (
        <Window
          key={`${id}-${index}`} //Adds index to key so that react recognises the changes and updates
          store={store}
          id={id}
        />
      ))}
    </div>
  );
}