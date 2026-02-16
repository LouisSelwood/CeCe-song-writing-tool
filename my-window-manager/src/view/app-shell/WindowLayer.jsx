import { Window } from "./Window.jsx";

export function WindowLayer({ store, windows }) {
  return (
    <>
      {windows.order.map(id => {
        const win = windows.byID[id];
        return (
          <Window
            key={id}
            store={store}
            win={win}
          />
        );
      })}
    </>
  );
}
