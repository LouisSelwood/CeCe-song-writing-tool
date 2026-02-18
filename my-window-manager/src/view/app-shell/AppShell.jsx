import "./css/AppShell.css";
import { Desktop } from "./Desktop.jsx";

export function AppShell({ store }) {

  return (
    
    <div className="app-shell">
      <div className="project-bar" style={{height: store.state.windows.projectBarHeight}}>

      </div>
      <Desktop store={store} />

    </div>
  );
}