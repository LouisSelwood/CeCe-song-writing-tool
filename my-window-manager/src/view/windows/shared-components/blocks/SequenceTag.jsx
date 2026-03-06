import "./blocks.css";

export function SequenceTag({ store, sequenceID, startBeat, length }) {
  const beatWidth = store.state.editor.beatWidth;
  const zoom = store.state.editor.zoomLevel;

  // Width and left must both scale with zoom
  const width = length * beatWidth * zoom;
  const left = startBeat * beatWidth * zoom;


  return (
    <div
      className="sequence-tag"
      style={{
        left: left + "px",
        width: width + "px",
        height: "30px",
        
      }}
    >
      
    </div>
  );
}