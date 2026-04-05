import "./buttons.css"
import {useState, useEffect} from "react"
export function AddSectionButton({ store }) {

  const [state, setState] = useState(store.state)
      useEffect(() => {
          const unsub = store.subscribe(() => {
              setState(store.state);
    
          });
          return unsub;
      }, []);
  
  const beatWidth = state.editor.beatWidth;
  const zoom = state.editor.zoomLevel;

  const left = state.editor.endPosition * beatWidth * zoom;
  return (
    <div
      className="add-section-button"
      style={{left: left + 20}}
    >
        +
    </div>
  );
}