import "./css/Desktop.css";
import { WindowLayer } from "./WindowLayer.jsx";
import {LeftDock} from "./docks/LeftDock.jsx";
import {RightDock} from "./docks/RightDock.jsx";
import {BottomDock} from "./docks/BottomDock.jsx";
import {SongEditor} from "../windows/song-editor/SongEditor.jsx"
/**
 * Wrapper for all components of the desktop
 * Responsible for structure of Desktop Surface (different windows, etc)
 */
export function Desktop({ store }) {

  return (
    <div className="desktop-surface">
      <div className="dock-vertical-container">
        <div className="dock-horizontal-container">
          <LeftDock store={store}/>
          <SongEditor store={store}/>
          <RightDock store={store}/>
        </div>
        <BottomDock store={store}/>
      </div>
      <WindowLayer store={store}/>
    </div>
  );
}
