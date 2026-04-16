import "./chordWorkshop.css";
import { useState, useEffect, useRef } from "react";
import { ChordEditor } from "./ChordEditor";
import { ChordSelector } from "./ChordSelector";

const COMMON_TIME_SIGNATURES = [
    [4, 4],
    [3, 4],
    [6, 8],
    [2, 4],
    [12, 8],
    [5, 4],
    [7, 8],
    [9, 8],
    [3, 8],
    [2, 2],
    [5, 8],
    [7, 4],
];


export function ChordWorkshop({ store }) {
    const [state, setState] = useState(store.state);
    const [songVersion, setSongVersion] = useState(store.state.project.songVersion)
    const [selectedSequence, setSelectedSequence] = useState(state.sequences.byID[state.editor.selectedSequenceID])
    const [selectorWidth, setSelectorWidth] = useState(200);

    const [editingTempo, setEditingTempo] = useState(false);
    const [tempoInput, setTempoInput] = useState("");

    const [editingTimeSig, setEditingTimeSig] = useState(false);
    const [timeSigInput, setTimeSigInput] = useState([4, 4]);


    const handleRef = useRef(null);

    useEffect(() => {
        store.actions.updateWorkshopFromSongSpace();
    },[])
    useEffect(() => {
        const unsub = store.subscribe(() => {
            setState({ ...store.state });
            setSongVersion(store.state.project.songVersion)
            setSelectedSequence(store.state.sequences.byID[store.state.editor.selectedSequenceID])
        });
        return unsub;
    }, []);

    useEffect(()=>{
        store.actions.updateWorkshopFromSongSpace();
    },[selectedSequence, songVersion])

    // ⭐ Resize logic
    useEffect(() => {
        function handleMouseMove(e) {
            setSelectorWidth(prev => {
                const newWidth = window.innerWidth - e.clientX;
                return newWidth // clamp
            });
        }

        function handleMouseUp() {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }

        function startResize() {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        const handle = handleRef.current;
        if (handle) handle.addEventListener("mousedown", startResize);

        return () => {
            if (handle) handle.removeEventListener("mousedown", startResize);
        };
    }, []);

    function commitTempo() {
        const seq = selectedSequence;
        if (!seq) return;

        const newTempo = parseFloat(tempoInput);
        if (!isNaN(newTempo) && newTempo > 0) {
            store.actions.setSequenceTempo(
                seq.id,
                newTempo
            );
        }

        setEditingTempo(false);
    }

    function commitTimeSignature(numerator, denominator) {
        const seq = selectedSequence;
        if (!seq) return;

        store.actions.setSequenceTimeSignature(
            seq.id,
            { numerator, denominator }
        );

        setEditingTimeSig(false);
    }



    return (
        <div className="chord-workshop">

            {/* Top Project Bar */}
            <div className="cw-project-bar">
                <div className="cw-left">
                    <label>Key:</label>
                    <span>{selectedSequence?.keySignature ?? ""}</span>

                    <label>Tempo:</label>

                    {editingTempo ? (
                        <input
                            className="cw-tempo-input"
                            autoFocus
                            value={tempoInput}
                            onChange={(e) => setTempoInput(e.target.value)}
                            onBlur={commitTempo}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") commitTempo();
                                if (e.key === "Escape") setEditingTempo(false);
                            }}
                        />
                    ) : (
                        <span
                            className="cw-tempo-display"
                            onClick={() => {
                                if(selectedSequence){
                                    setTempoInput(selectedSequence?.tempo ?? "");
                                    setEditingTempo(true);
                                }
                            }}
                        >
                            {selectedSequence?.tempo ?? ""} BPM
                        </span>
                    )}

                    <label>Time Sig:</label>

                    <div className="cw-timesig-wrapper">
                        {editingTimeSig ? (
                            <div className="cw-timesig-dropdown">
                                {COMMON_TIME_SIGNATURES.map(([num, den]) => (
                                    <div
                                        key={`${num}/${den}`}
                                        className="cw-timesig-option"
                                        onClick={() => commitTimeSignature(num, den)}
                                    >
                                        {num}/{den}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span
                                className="cw-timesig-display"
                                onClick={() => {
                                    if (selectedSequence) {
                                        setTimeSigInput([
                                            selectedSequence.timeSignature?.numerator ?? 4,
                                            selectedSequence.timeSignature?.denominator ?? 4
                                        ]);
                                        setEditingTimeSig(true);
                                    }
                                }}
                            >
                                {selectedSequence?.timeSignature
                                    ? `${selectedSequence.timeSignature.numerator}/${selectedSequence.timeSignature.denominator}`
                                    : ""}
                            </span>
                        )}
                    </div>

                </div>

                <div className="cw-right">
                    <button onClick={() => store.actions.wsRewind()}>⏮</button>
                    <button onClick={() => store.actions.wsFlipPlay()}>▶</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="cw-content">

            {/* ⭐ Left Button Column */}
            <div className="cw-left-buttons">
                <button onClick={() => store.actions.copySelectedChords()}>
                    Copy
                </button>
                <button onClick={() => store.actions.deleteSelectedChords()}>
                    Delete
                </button>
                <button onClick={() => store.actions.deleteSelectedChords()}>
                    Edit
                </button>
            </div>

            <div className="cw-chord-editor">
                {state.editor.selectedSequenceID && state.workshop.songSpace !== null && (
                    <ChordEditor store={store} />
                )}
            </div>

            <div
                className="cw-chord-selector"
                style={{ width: selectorWidth }}
            >
                <div className="cw-selector-resize-handle" ref={handleRef} />
                {state.workshop.newChordPos !== null && (
                    <ChordSelector store={store}/>
                )}
            </div>

        </div>
        </div>
    );
}
