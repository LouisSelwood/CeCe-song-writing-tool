import "./buttons.css";
import { useState, useEffect } from "react";

export function InsertSectionButton({ store }) {
  const [state, setState] = useState(store.state);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setState(store.state);
    });
    return unsub;
  }, [store]);

  const beatWidth = state.editor.beatWidth;
  const zoom = state.editor.zoomLevel;

  const left = state.editor.hoveredGapPosition * beatWidth * zoom;

  const handleMouseLeave = () => {
    store.actions.setHoveredGap(null);
    console.log("Mouse Left Marker");
  };

  function openInsertSection() {
    const currentHover = store.state.editor.hoveredGapPosition;
    if (currentHover == null) return;

    store.actions.setActiveInsertPopup(true);
    store.actions.setPopupPosition(currentHover);
  }

  if (state.editor.hoveredGapPosition === null) return null;

  return (
    <div
      className="add-section-insert"
      style={{ left: left - 15 }}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="insert-circle"
        onMouseDown={openInsertSection}
      >
        +
      </div>
      <div className="insert-line" />
    </div>
  );
}
