import "./chordEditor.css";
import { useState, useEffect } from "react";

export function InsertChordButton({ store }) {
  const [state, setState] = useState(store.state);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setState(store.state);
    });
    return unsub;
  }, [store]);

  const beatWidth = 40;
  const zoom = state.workshop.zoomLevel;

  const left = (state.workshop.hoveredGapPosition * beatWidth * zoom) - state.workshop.scrollX;

  const handleMouseLeave = () => {
    store.actions.setChordHoveredGapPosition(null);
    console.log("Mouse Left Marker");
  };

  const handleInsert = () => {
    store.actions.initiateChordSelection()
    store.actions.getRecommendedChordData();
  }


  if (state.workshop.hoveredGapPosition === null) return null;

  return (
    <div
      className="add-section-insert"
      style={{ left: left - 15 }}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="insert-circle"
        onMouseDown={handleInsert}
      >
        +
      </div>
      <div className="insert-line" />
    </div>
  );
}
