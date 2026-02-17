import "./css/AppShell.css";
import { Desktop } from "./Desktop.jsx";

export function AppShell({ store }) {

  return (
    <div className="app-shell">
      <Desktop store={store} />
    </div>
  );
}