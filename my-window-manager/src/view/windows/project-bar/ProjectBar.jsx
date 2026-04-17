import "./projectBar.css";
import { useState, useEffect, useRef } from "react";
import { MidiSettings } from "./MidiSettings.jsx";
import playIcon from "../../../assets/icons/play.png";
import pauseIcon from "../../../assets/icons/pause.png";
import backIcon from "../../../assets/icons/rewind.png";
import forwardIcon from "../../../assets/icons/fastForward.png";

export function ProjectBar({ store }) {

    const height = store.state.windows.projectBarHeight;

    const [state, setState] = useState(store.state);
    const [isMidiOpen, setIsMidiOpen] = useState(false);

    // ⭐ Title editing state
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState("");

    const popupRef = useRef(null);

    useEffect(() => {
        const unsub = store.subscribe(() => {
            setState({ ...store.state });
        });
        return unsub;
    }, []);

    // ⭐ Close MIDI popup when clicking outside
    useEffect(() => {
        function handleClick(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setIsMidiOpen(false);
            }
        }
        if (isMidiOpen) {
            document.addEventListener("mousedown", handleClick);
        }
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isMidiOpen]);

    // ⭐ Commit project name change
    const commitName = () => {
        const name = tempName.trim();
        if (name.length > 0) {
            store.actions.setProjectName(name);
        }
        setIsEditing(false);
    };

    return (
        <div 
            className="project-bar"
            style={{ height }}
        >
            {/* LEFT SIDE */}
            <div className="project-bar-left">

                {/* ⭐ Editable Title */}
                {isEditing ? (
                    <input
                        className="project-title-input"
                        value={tempName}
                        autoFocus
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") commitName();
                            if (e.key === "Escape") setIsEditing(false);
                        }}
                    />
                ) : (
                    <>
                        <span className="project-title">
                            {state.project.currentProject?.name || "Untitled Project"}
                        </span>

                        <button
                            className="edit-title-btn"
                            onClick={() => {
                                setTempName(state.project.currentProject?.name || "");
                                setIsEditing(true);
                            }}
                        >
                            ✎
                        </button>
                    </>
                )}
            </div>

            {/* CENTER */}
            <div className="project-bar-center">
                <button onClick={() => store.actions.rewind()}>
                     <img src={backIcon} alt="back" style={{height: "60%", width: "60%", marginTop: "4px",marginRight: "4px"}}/>
                </button>
                <button onClick={() => store.actions.flipPlay()}>
                    {state.player.isPlaying 
                    ? 
                     <img src={pauseIcon} alt="pause" style={{height: "40%", width: "40%", marginTop: "4px"}}/> 
                    :
                     <img src={playIcon} alt="play" style={{height: "40%", width: "40%",marginTop: "4px", marginLeft: "4px"}}/>}
                </button>
                <button onClick={() => store.actions.fastForward()}>
                     <img src={forwardIcon} alt="forward" style={{height: "60%", width: "60%", marginTop: "4px",marginLeft: "4px"}}/>
                </button>
            </div>

            {/* RIGHT */}
            <div className="project-bar-right">
                <button onClick={() => setIsMidiOpen(prev => !prev)}>
                    MIDI
                </button>
            </div>

            {/* ⭐ MIDI SETTINGS POPUP */}
            {isMidiOpen && (
                <div ref={popupRef}>
                    <MidiSettings store={store} state={state}/>
                </div>
            )}
        </div>
    );
}
