import { useState, useEffect, useRef } from "react"
import "./chordEditor.css";

export function NewChordBlock({ store }) {
    const ws = store.state.workshop;
    const left = (ws.newChordPos * 40 * ws.zoomLevel) - ws.scrollX;
    const width = (ws.newChordLength * 40 * ws.zoomLevel);
    return (
        <div
            className="new-chord-block"
            style={{
                left,
                width,
            }}
        >

            {ws.newChordSelected.chordName !== null ? ws.newChordSelected.chordName : "B"}
        </div>
    );
}