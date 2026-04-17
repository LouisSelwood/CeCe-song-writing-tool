import "./blocks.css";
import { useRef, useEffect } from "react";

export function SequenceBlock({ store, sequenceID, startBeat, length }) {
  if(!Object.keys(store.state.sequences.byID).includes(sequenceID)){return}
  // Layout values
  const beatWidth = store.state.editor.beatWidth;
  const zoom = store.state.editor.zoomLevel;

  const width = length * beatWidth * zoom;
  const left = startBeat * beatWidth * zoom;
  const fontSize = Math.max(10, zoom * 5);

  // Non‑layout info
  const sequenceParent = store.selectors.sequences.getSequenceParent(store.state, sequenceID);
  const sequenceType = store.selectors.sections.getSectionType(sequenceParent, store.state);
  const contents = store.selectors.sequences.getChordsAsNotation(store.state, sequenceID);

  const ref = useRef(null);
  const editor = store.state.editor;

  // CLICK HANDLER ---------------------------------------------------------
  const handleClick = (e) => {
    const isShift = e.shiftKey;

    const allSequences = Object.entries(store.state.editor.songSpace.objects)
      .filter(([_, v]) => v.type === "sequence")
      .map(([id, v]) => ({ id, startBeat: v.startBeat }))
      .sort((a, b) => a.startBeat - b.startBeat);

    if (!isShift) {
      store.actions.setSelectedSequence(sequenceID);
      return;
    }

    const anchor = editor.selectedSequenceID;

    if (!anchor) {
      store.actions.setSelectedSequence(sequenceID);
      return;
    }

    const anchorIndex = allSequences.findIndex((s) => s.id === anchor);
    const clickedIndex = allSequences.findIndex((s) => s.id === sequenceID);

    if (anchorIndex === -1 || clickedIndex === -1) {
      store.actions.setSelectedSequence(sequenceID);
      return;
    }

    const start = Math.min(anchorIndex, clickedIndex);
    const end = Math.max(anchorIndex, clickedIndex);

    const rangeIDs = allSequences.slice(start, end + 1).map((s) => s.id);
    store.actions.setSelectedSequenceRange(rangeIDs);
  };

  // DRAG START ------------------------------------------------------------
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    const selIDs = editor.selectedSequenceIDs;
    const selID = editor.selectedSequenceID;

    let dragIDs = [];

    if (selIDs.length === 0 && !selID) {
      dragIDs = [sequenceID];
      store.actions.setSelectedSequence(sequenceID);
    } else if (selIDs.length === 0 && selID) {
      dragIDs = [selID];
    } else {
      dragIDs = selIDs;
    }

    const { x, y } = store.state.windows.mousePos;
    store.actions.startSequenceDrag(x, y, dragIDs);
  };



  // HOVER GAP LOGIC -------------------------------------------------------
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const threshold = 12;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const distLeft = e.clientX - rect.left;
      const distRight = rect.right - e.clientX;

      if (distLeft < threshold) {
        store.actions.setHoveredGap(startBeat);
      } else if (distRight < threshold) {
        store.actions.setHoveredGap(startBeat + length);
      } else {
        store.actions.setHoveredGap(null);
      }
    };

    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);

  }, [startBeat, length]);

  // SELECTION COLOUR ------------------------------------------------------
  const isSelected = store.state.editor.selectedSequenceIDs.includes(sequenceID);
  const parentName = store.state.sections.byID[sequenceParent].name;
  const baseColour = store.state.editor.sectionColours[parentName] || "#c37171";
  const finalColour = isSelected ? darken(baseColour, 50) : baseColour;

  // DRAG VISUALS ----------------------------------------------------------
  const isDragging =
    editor.sequenceDrag.active &&
    editor.sequenceDrag.sequenceIDs.includes(sequenceID);

  const translateX = isDragging ? editor.sequenceDrag.offsetX : 0;
  const translateY = isDragging ? editor.sequenceDrag.offsetY : 0;

  const liftStyle = isDragging
    ? {
        transform: `translate(${translateX}px, ${translateY}px) scale(1.03)`,
        boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
        zIndex: 10,
        pointerEvents: "none" // IMPORTANT: allows gap detection
      }
    : {
        transform: "translate(0, 0)",
        boxShadow: "none",
        zIndex: 1,
        pointerEvents: "auto"
      };

  return (
    <div
      className="sequence-block"
      ref={ref}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{
        left: left + "px",
        width: width + "px",
        height: "80px",
        fontSize: fontSize + "px",
        backgroundColor: finalColour,
        position: "absolute",
        ...liftStyle
      }}
    >
      {contents.map((content, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            width: content.length * beatWidth * zoom,
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
          }}
        >
          {content.name}
        </div>
      ))}
    </div>
  );
}

// Utility: same darken function used in SectionBlock
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
