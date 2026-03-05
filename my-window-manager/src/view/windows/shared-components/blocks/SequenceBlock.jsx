import "./blocks.css";
export function SequenceBlock({store, sequenceID}) {
    const width = 
    store.selectors.sequences.getSequenceWidth(store.state, sequenceID) * 
    store.state.editor.beatWidth * 
    store.state.editor.zoomLevel;
    const chordTitles = store.selectors.sequences.getContentsAsString(store.state, sequenceID);
    const fontSize = Math.max(10, width * 0.1);
    return(
        <div className="sequence-block" style={{height: "100px", width: width + "px", fontSize}}>
            {chordTitles.map((title, index) => (
                <div key={index} className="chord-title">
                    {title}
                </div>
            ))}

        </div>
    );
}