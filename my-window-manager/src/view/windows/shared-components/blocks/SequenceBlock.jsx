import "./blocks.css";

export function SequenceBlock({ store, sequenceID, startBeat, length }) {
  const beatWidth = store.state.editor.beatWidth;
  const zoom = store.state.editor.zoomLevel;

  // Width and left must both scale with zoom
  const width = length * beatWidth * zoom;
  const left = startBeat * beatWidth * zoom;

  // Optional: scale font size with width
  const fontSize = Math.max(10, zoom * 5);
  const contents = store.selectors.sequences.getChordsAsNotation(store.state, sequenceID)
  return (
    <div
      className="sequence-block"
      style={{
        left: left + "px",
        width: width + "px",
        height: "100px",
        fontSize: fontSize + "px"
      }}
    >

      {contents.map((content, index) => (
        <div key={index}>
          {content}
        </div>
      ))}



    </div>
  );
}