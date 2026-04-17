import "./chordWorkshop.css";
import { useState, useEffect, useRef } from "react";
import { ChordEditor } from "./ChordEditor";
import { ChordSelector } from "./ChordSelector";
import copyIcon from "../../../assets/icons/copy.png";
import deleteIcon from "../../../assets/icons/delete.png"

const COMMON_TIME_SIGNATURES = [
    [4, 4], [3, 4], [6, 8], [2, 4], [12, 8],
    [5, 4], [7, 8], [9, 8], [3, 8], [2, 2],
    [5, 8], [7, 4],
];

const COMMON_KEYS = [
    "C major",
    "G major",
    "D major",
    "A major",
    "E major",
    "B major",
    "F# major",
    "C# major",

    "F major",
    "Bb major",
    "Eb major",
    "Ab major",
    "Db major",
    "Gb major",
    "Cb major",

    "A minor",
    "E minor",
    "B minor",
    "F# minor",
    "C# minor",
    "G# minor",
    "D# minor",
    "A# minor",

    "D minor",
    "G minor",
    "C minor",
    "F minor",
    "Bb minor",
    "Eb minor",
    "Ab minor"
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

    // ⭐ NEW: Key signature editing
    const [editingKeySig, setEditingKeySig] = useState(false);
    const [keySigInput, setKeySigInput] = useState("");

    const [editingSectionName, setEditingSectionName] = useState(false);
    const [sectionNameInput, setSectionNameInput] = useState("");

    const parentSection = state.sections.byID[
        store.selectors.sequences.getSequenceParent(state, state.editor.selectedSequenceID)
    ];

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

    // Resize logic unchanged...
    useEffect(() => {
        function handleMouseMove(e) {
            setSelectorWidth(window.innerWidth - e.clientX);
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
        return () => handle?.removeEventListener("mousedown", startResize);
    }, []);

    function commitTempo() {
        const seq = selectedSequence;
        if (!seq) return;
        const newTempo = parseFloat(tempoInput);
        if (!isNaN(newTempo) && newTempo > 0) {
            store.actions.setSequenceTempo(seq.id, newTempo);
        }
        setEditingTempo(false);
    }

    function commitTimeSignature(numerator, denominator) {
        const seq = selectedSequence;
        if (!seq) return;
        store.actions.setSequenceTimeSignature(seq.id, { numerator, denominator });
        setEditingTimeSig(false);
    }

    // ⭐ NEW: Commit key signature
    function commitKeySignature(newKey) {
        const seq = selectedSequence;
        if (!seq) return;
        store.actions.setSequenceKeySignature(seq.id, newKey);
        setEditingKeySig(false);
    }

    return (
        <div className="chord-workshop">

            {/* Top Project Bar */}
            <div className="cw-project-bar">
                <div className="cw-left">

                    {/* ⭐ KEY SIGNATURE */}
                    <label>Key:</label>
                    <div className="cw-key-wrapper">
                        {editingKeySig ? (
                            <div className="cw-key-dropdown">
                                {COMMON_KEYS.map(key => (
                                    <div
                                        key={key}
                                        className="cw-key-option"
                                        onClick={() => commitKeySignature(key)}
                                    >
                                        {key}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span
                                className="cw-key-display"
                                onClick={() => {
                                    setKeySigInput(selectedSequence?.keySignature ?? "");
                                    setEditingKeySig(true);
                                }}
                            >
                                {selectedSequence?.keySignature ?? ""}
                            </span>
                        )}
                    </div>

                    {/* TEMPO (unchanged) */}
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

                    {/* TIME SIGNATURE (unchanged) */}
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

                {/* RIGHT SIDE (unchanged except for section name) */}
                <div className="cw-right">
                    {parentSection && (
                        editingSectionName ? (
                            <input
                                className="cw-sectionname-input"
                                autoFocus
                                value={sectionNameInput}
                                onChange={(e) => setSectionNameInput(e.target.value)}
                                onBlur={() => {
                                    const trimmed = sectionNameInput.trim();
                                    if (trimmed && trimmed !== parentSection.name) {
                                        store.actions.changeSectionName(parentSection.id, trimmed);
                                    }
                                    setEditingSectionName(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const trimmed = sectionNameInput.trim();
                                        if (trimmed && trimmed !== parentSection.name) {
                                            store.actions.changeSectionName(parentSection.id, trimmed);
                                        }
                                        setEditingSectionName(false);
                                    }
                                    if (e.key === "Escape") {
                                        setEditingSectionName(false);
                                    }
                                }}
                            />
                        ) : (
                            <span
                                className="cw-sectionname-display"
                                onClick={() => {
                                    setSectionNameInput(parentSection.name ?? "");
                                    setEditingSectionName(true);
                                }}
                            >
                                {parentSection.name}
                            </span>
                        )
                    )}

                    <button onClick={() => store.actions.wsRewind()}>⏮</button>
                    <button onClick={() => store.actions.wsFlipPlay()}>▶</button>
                </div>
            </div>

            {/* Main Content (unchanged) */}
            <div className="cw-content">
                {state.workshop.selectedChordID !== null && (
                    <div className="cw-left-buttons">
                    <button onClick={() => store.actions.copySelectedChords()}>
                        <img src={copyIcon} alt="copy" style={{height: "60%", width: "60%"}}/>
                    </button>
                    <button onClick={() => store.actions.deleteSelectedChords()}>
                        <img src={deleteIcon} alt="delete" style={{height: "60%", width: "60%"}}/>
                    </button>
                </div>
                )}

                <div className="cw-chord-editor">
                    {state.editor.selectedSequenceID && state.workshop.songSpace !== null && (
                        <ChordEditor store={store} />
                    )}
                </div>

                <div className="cw-chord-selector" style={{ width: selectorWidth }}>
                    <div className="cw-selector-resize-handle" ref={handleRef} />
                    {state.workshop.newChordPos !== null && (
                        <ChordSelector store={store}/>
                    )}
                </div>
            </div>
        </div>
    );
}
