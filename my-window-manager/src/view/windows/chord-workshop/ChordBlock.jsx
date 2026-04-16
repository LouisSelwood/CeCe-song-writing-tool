import { useState, useEffect, useRef } from "react"

function darken(hex, percent) {
    const amt = Math.round(2.55 * percent);
    const R = parseInt(hex.substring(1, 3), 16) - amt;
    const G = parseInt(hex.substring(3, 5), 16) - amt;
    const B = parseInt(hex.substring(5, 7), 16) - amt;

    return (
        "#" +
        (0 | (R < 0 ? 0 : R)).toString(16).padStart(2, "0") +
        (0 | (G < 0 ? 0 : G)).toString(16).padStart(2, "0") +
        (0 | (B < 0 ? 0 : B)).toString(16).padStart(2, "0")
    );
}

export function ChordBlock({ store, obj }) {

    const state = store.state;
    const ws = state.workshop;
    const scrollX = ws.scrollX;
    const zoom = ws.zoomLevel;
    const beatWidth = 40 * zoom; // base width per beat
    const left = obj.startBeat * beatWidth - scrollX;
    const width = obj.durationBeats * beatWidth;
    const ref = useRef(null);

    const handleClick = (chordID, e) => {

        const isShift = e.shiftKey;

        if (isShift) {
            const anchor = ws.selectedChordID;

            const allChords = Object.entries(ws.songSpace.objects)
                .map(([id, v]) => ({ id, startBeat: v.startBeat }))
                .sort((a, b) => a.startBeat - b.startBeat);

            if (!anchor) {
                store.actions.setSelectedChord(chordID);
                return;
            }

            const anchorIndex = allChords.findIndex((c) => c.id === anchor);
            const clickedIndex = allChords.findIndex((c) => c.id === chordID);

            if (anchorIndex === -1 || clickedIndex === -1) {
                store.actions.setSelectedChord(chordID);
                return;
            }

            const start = Math.min(anchorIndex, clickedIndex);
            const end = Math.max(anchorIndex, clickedIndex);
            const rangeIDs = allChords.slice(start, end + 1).map((c) => c.id);

            store.actions.setSelectedChordRange(rangeIDs);
        } else {
            store.actions.setSelectedChord(chordID);
            store.actions.setSelectedChordRange([chordID]);
        }
    };

    
      // -------------------------------
      // DRAG START
      // -------------------------------
      const handleMouseDown = (e) => {
        if (e.button !== 0) return;

        const resizeID = ws.hoveredChordResizeID;
        if (resizeID === obj.id) {
            const { x } = store.state.windows.mousePos;
            store.actions.startChordResize(x, obj.id);
            return;
        }

        // otherwise normal drag
        const selIDs = ws.selectedChordIDs;
        const selID = ws.selectedChordID;

        let dragIDs = [];

        if (selIDs.length === 0 && !selID) {
            dragIDs = [obj.id];
            store.actions.setSelectedChord(obj.id);
        } else if (selIDs.length === 0 && selID) {
            dragIDs = [selID];
        } else {
            dragIDs = selIDs;
        }

        const { x, y } = store.state.windows.mousePos;
        store.actions.startChordDrag(x, y, dragIDs);
    };
      // -------------------------------
      // HOVER GAP LOGIC (unchanged)
      // -------------------------------
      useEffect(() => {
        const el = ref.current;
        if (!el) return;
    
        const threshold = 5;
    
        const handleMouseMove = (e) => {
            const rect = el.getBoundingClientRect();
            const distLeft = e.clientX - rect.left;
            const distRight = rect.right - e.clientX;

            if (distLeft < threshold) {
            store.actions.setChordHoveredGapPosition(obj.startBeat);
            } else if (distRight < threshold) {
            store.actions.setChordHoveredGapPosition(obj.startBeat + obj.durationBeats);
            } else {
            store.actions.setChordHoveredGapPosition(null);
            }

            const rthreshold = 6;
    

                if (distRight < rthreshold) {
                    store.actions.setChordHoveredResize(obj.id);
                } else {
                    store.actions.setChordHoveredResize(null);
                }

            };
    
        el.addEventListener("mousemove", handleMouseMove);
        return () => el.removeEventListener("mousemove", handleMouseMove);
      }, [obj.startBeat, obj.durationBeats]);
    
      // -------------------------------
      // VISUAL + DRAG STYLING
      // -------------------------------
      const isSelected = ws.selectedChordIDs.includes(obj.id);
      const isDragging =
        ws.chordDrag.started && ws.chordDrag.chordIDs.includes(obj.id);
    
      const translateX = isDragging ? ws.chordDrag.offsetX : 0;
      const translateY = isDragging ? ws.chordDrag.offsetY : 0;
    
      const liftStyle = isDragging
        ? {
            transform: `translate(${translateX}px, ${translateY}px) scale(1.03)`,
            boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
            zIndex: 10,
            pointerEvents: "none" // ⬅️ IMPORTANT: allows gap detection
          }
        : {
            transform: "translate(0, -50%)",
            boxShadow: "none",
            zIndex: 1,
            pointerEvents: "auto"
          };
    
    const background = ws.selectedChordIDs.includes(obj.id) || ws.selectedChordID === obj.id? darken("#8fa98f", 25) : "#8fa98f";

    return (
        <div
            ref={ref}
            key={obj.id}
            className="chord-block"
            style={{
                left,
                width,
                background,
                ...liftStyle
            }}
            onClick={(e) => handleClick(obj.id, e)}
            onMouseDown={handleMouseDown}
        >
            {store.selectors.chords.getChordAsString(state, obj.id)}
        </div>
    );
}