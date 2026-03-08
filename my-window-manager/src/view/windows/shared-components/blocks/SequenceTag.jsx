import "./blocks.css";

export function SequenceTag({ store, sequenceID, startBeat, length }) {
  const beatWidth = store.state.editor.beatWidth;
  const zoom = store.state.editor.zoomLevel;

  // Width and left must both scale with zoom
  const width = length * beatWidth * zoom;
  const left = startBeat * beatWidth * zoom;
  const contents = store.selectors.sequences.getChordsAsNotation(store.state, sequenceID);
  console.log(contents)


  return (
    <div
      className="sequence-tag"
      style={{
        left: left + "px",
        width: width + "px",
        height: "30px",
        
      }}
    >
      {contents.map((content, index) => (
        <div key={index} style={{
          display: "flex", 
          width: content.length * store.state.editor.beatWidth * store.state.editor.zoomLevel, 
          justifyContent: "center"}}
        > 
          {content.notation}
        </div>
      ))}

    </div>
  );
}