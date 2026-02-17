import { Window } from "./Window.jsx";
import { useState, useEffect } from "react";

export function WindowLayer({ store }) {
  const [windows, setWindows] = useState(store.state.windows);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const next = store.state.windows;

      // force new references so React *must* re-render
      setWindows({
        ...next,
        order: [...next.order],
        byID: { ...next.byID },
      });
    });
    return unsub;
  }, [store]);


  return (
    <>
      {windows.order.map((id, index) => (
        <Window
          key={`${id}-${index}`}
          store={store}
          id={id}
        />
      ))}
    </>
  );
}