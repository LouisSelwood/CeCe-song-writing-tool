import "./css/Desktop.css";
import { WindowLayer } from "./WindowLayer.jsx";
/**
 * Wrapper for all components of the desktop
 * Responsible for structure of Desktop Surface (different windows, etc)
 */
export function Desktop({ store }) {

  return (
    <div className="desktop-surface">
      <WindowLayer store={store}/>
    </div>
  );
}
