import { useState, useEffect } from "react";
import "./chordSelector.css";

export function ChordSelector({ store }) {

    const [state, setState] = useState(store.state);
    const [customChord, setCustomChord] = useState("");

    useEffect(() => {
        const unsub = store.subscribe(() => {
            setState({ ...store.state });
        });
        return unsub;
    }, [store]);

    if (state.workshop.recommendedChordData === null) return null;

    const recommendedChordsL1 = state.workshop.recommendedChordData.Normal;
    const recommendedChordsL2 = state.workshop.recommendedChordData.Uncommon;
    const recommendedChordsL3 = state.workshop.recommendedChordData.Strange;
    const recommendedChordsL4 = state.workshop.recommendedChordData.Unadvisable;

    function selectChordRecommendation(chordName) {
        const chord = store.selectors.workshop.parseChordName(chordName);
        store.actions.setNewChord(chord);
    }

    function commitCustomChord() {
        const trimmed = customChord.trim();
        if (!trimmed) return;

        const chord = store.selectors.workshop.parseChordName(trimmed);
        store.actions.setNewChord(chord);
    }

    return (
        <div className="chord-selector-root">

            {/* ⭐ Custom Chord Input */}
            <div className="custom-chord-input-wrapper">
                <input
                    className="custom-chord-input"
                    placeholder="Enter custom chord..."
                    value={customChord}
                    onChange={(e) => setCustomChord(e.target.value)}
                    onBlur={commitCustomChord}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") commitCustomChord();
                    }}
                />
            </div>

            {/* Level 1 */}
            <div className="chord-section">
                <div className="chord-section-title">Common</div>
                <div className="chord-row">
                    {recommendedChordsL1.map(chord => (
                        <div key={chord} className="chord-pill" onClick={() => selectChordRecommendation(chord)}>
                            {chord}
                        </div>
                    ))}
                </div>
            </div>

            {/* Level 2 */}
            <div className="chord-section">
                <div className="chord-section-title">Uncommon</div>
                <div className="chord-row">
                    {recommendedChordsL2.map(chord => (
                        <div key={chord} className="chord-pill" onClick={() => selectChordRecommendation(chord)}>
                            {chord}
                        </div>
                    ))}
                </div>
            </div>

            {/* Level 3 */}
            <div className="chord-section">
                <div className="chord-section-title">Strange</div>
                <div className="chord-row">
                    {recommendedChordsL3.map(chord => (
                        <div key={chord} className="chord-pill" onClick={() => selectChordRecommendation(chord)}>
                            {chord}
                        </div>
                    ))}
                </div>
            </div>

            {/* Level 4 */}
            <div className="chord-section">
                <div className="chord-section-title">Unadvisable</div>
                <div className="chord-row">
                    {recommendedChordsL4.map(chord => (
                        <div key={chord} className="chord-pill" onClick={() => selectChordRecommendation(chord)}>
                            {chord}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
