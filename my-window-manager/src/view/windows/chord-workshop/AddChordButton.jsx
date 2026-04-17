// SquareButton.jsx
import "./chordEditor.css";

export function AddChordButton({ store }) {
    const ws = store.state.workshop;
    const endBeat = store.selectors.workshop.getEndBeat(store.state.workshop.songSpace);
    const zoom = ws.zoomLevel;
    const left = endBeat * 40 * zoom - ws.scrollX
    function AddChord(){
        store.actions.initiateChordSelection(endBeat === 0 ? 0 : endBeat+1)
        store.actions.getRecommendedChordData();

    }
    return (
        <div className="add-chord-button" onClick={AddChord} style={{left: left + 40}}>
            +
        </div>
    );
}
