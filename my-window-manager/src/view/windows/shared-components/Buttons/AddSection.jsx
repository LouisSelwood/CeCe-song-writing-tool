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
  function openAddSections(){
    store.actions.setActiveAddPopup(true);
    console.log(state.editor.endPosition)
    store.actions.setPopupPosition(state.editor.endPosition)
  }
  return (
    <div
      className="add-section-button"
      style={{left: left + 20}}
      onMouseDown={(openAddSections)}
    >
        +
    </div>
  );
}