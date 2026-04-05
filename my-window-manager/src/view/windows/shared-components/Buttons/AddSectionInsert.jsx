import "./buttons.css"
import { useState, useEffect } from "react"

export function AddSectionInsert({ store }) {
  const [state, setState] = useState(store.state);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setState(store.state);
    });
    return unsub;
  }, []);

  const beatWidth = state.editor.beatWidth;
  const zoom = state.editor.zoomLevel;

  if (state.editor.hoveredGapPosition === null) return null;

  const left = state.editor.hoveredGapPosition * beatWidth * zoom;

  const handleMouseLeave = () => {
    store.actions.setHoveredGap(null);
    console.log("Mouse Left Marker");
  };

  return (
    <div
      className="add-section-insert"
      style={{ left: left - 15 }}
      onMouseLeave={handleMouseLeave}
    >
      <div className="insert-circle">+</div>
      <div className="insert-line" />
    </div>
  );
}
