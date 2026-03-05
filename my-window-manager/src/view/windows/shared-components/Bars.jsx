import "../song-editor/SongEditor.css";
import {buildBars} from "../../components/buildBars.jsx"
export function Bars({ state }){
    const bars = buildBars(state)
    const beatWidth = state.editor.beatWidth;
    const zoom = state.editor.zoomLevel;
    return (
    <div className="bars-layer">
        {bars.map((bar) => {
        const left = bar.barIndex * beatWidth * zoom;

        return (
            <div
            key={bar.barIndex}
            className={bar.barStart ? "songspace-bar-line" : "songspace-beat-line"}
            style={{
                position: "absolute",
                left,
            }}
            >
            <div className="bar-label">
                {bar.barIndex + 1}
            </div>
            </div>
        );
        })}
    </div>
    );
};
