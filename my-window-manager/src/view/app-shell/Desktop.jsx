import { WindowLayer } from "./WindowLayer.jsx";

export function Desktop({ store }) {

  return (
    <div className="desktop">
      <WindowLayer store={store}/>
    </div>
  );
}
