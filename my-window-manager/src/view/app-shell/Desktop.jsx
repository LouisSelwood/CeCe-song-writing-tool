import { WindowLayer } from "./WindowLayer.jsx";

export function Desktop({ store }) {
  const state = store.getState();

  return (
    <div className="desktop">
      <WindowLayer store={store} windows={state.windows} />
    </div>
  );
}
