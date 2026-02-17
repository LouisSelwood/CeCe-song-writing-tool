import "./css/Desktop.css";
import { WindowLayer } from "./WindowLayer.jsx";

export function Desktop({ store }) {

  return (
    <div className="desktop-surface">
      <WindowLayer store={store}/>
    </div>
  );
}
