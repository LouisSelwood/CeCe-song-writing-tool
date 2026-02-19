import "./css/AppShell.css";
import { Desktop } from "./Desktop.jsx";

/**
 * Top-level layout wrapper for the desktop enviroment
 * Responsible for base structural framing (Project bar + Desktop)
 * Passes store down to children
 */
export function AppShell({ store }) {

  return (
    
    <div className="app-shell">
      <div className="project-bar" style={{height: store.state.windows.projectBarHeight}}>

      </div>
      <Desktop store={store} />

    </div>
  );
}