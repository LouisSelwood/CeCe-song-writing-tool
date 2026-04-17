import "./blocks.css";
import { useRef, useEffect } from "react";

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

export function SectionBlock({ store, sectionID, startBeat, length }) {
  if(store.state.windows.mousePos === null){return}
  if(!Object.keys(store.state.sections.byID).includes(sectionID)){return}

  const beatWidth = store.state.editor.beatWidth;
  const zoom = store.state.editor.zoomLevel;

  const width = length * beatWidth * zoom;
  const left = startBeat * beatWidth * zoom;
  const fontSize = Math.max(10, zoom * 5);

  const ref = useRef(null);
  const editor = store.state.editor;

  // -------------------------------
  // CLICK (selection)
  // -------------------------------
  const handleClick = (e) => {
    const isShift = e.shiftKey;

    if (isShift) {
      const anchor = editor.selectedSectionID;

      const allSections = Object.entries(editor.songSpace.objects)
        .filter(([_, v]) => v.type === "section")
        .map(([id, v]) => ({ id, startBeat: v.startBeat }))
        .sort((a, b) => a.startBeat - b.startBeat);

      if (!anchor) {
        store.actions.setSelectedSection(sectionID);
        return;
      }

      const anchorIndex = allSections.findIndex((s) => s.id === anchor);
      const clickedIndex = allSections.findIndex((s) => s.id === sectionID);

      if (anchorIndex === -1 || clickedIndex === -1) {
        store.actions.setSelectedSection(sectionID);
        return;
      }

      const start = Math.min(anchorIndex, clickedIndex);
      const end = Math.max(anchorIndex, clickedIndex);
      const rangeIDs = allSections.slice(start, end + 1).map((s) => s.id);

      store.actions.setSelectedSectionRange(rangeIDs);
    } else {
      store.actions.setSelectedSection(sectionID);
    }
  };

  // -------------------------------
  // DRAG START
  // -------------------------------
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;

    const selIDs = editor.selectedSectionIDs;
    const selID = editor.selectedSectionID;

    let dragIDs = [];

    if (selIDs.length === 0 && !selID) {
      dragIDs = [sectionID];
      store.actions.setSelectedSection(sectionID);
    } else if (selIDs.length === 0 && selID) {
      dragIDs = [selID];
    } else {
      dragIDs = selIDs;
    }

    const { x, y } = store.state.windows.mousePos;
    store.actions.startSectionDrag(x, y, dragIDs);
  };

  // -------------------------------
  // HOVER GAP LOGIC (unchanged)
  // -------------------------------
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const threshold = 6;

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

  // -------------------------------
  // VISUAL + DRAG STYLING
  // -------------------------------
  const sectionName = store.state.sections.byID[sectionID].name;
  const baseColour =
    store.state.editor.sectionColours[sectionName] || "#c37171";

  const isSelected = editor.selectedSectionIDs.includes(sectionID);
  const isDragging =
    editor.drag.active && editor.drag.sectionIDs.includes(sectionID);

  const colour = isSelected ? darken(baseColour, 50) : baseColour;

  const translateX = isDragging ? editor.drag.offsetX : 0;
  const translateY = isDragging ? editor.drag.offsetY : 0;

  const liftStyle = isDragging
    ? {
        transform: `translate(${translateX}px, ${translateY}px) scale(1.03)`,
        boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
        zIndex: 10,
        pointerEvents: "none" // ⬅️ IMPORTANT: allows gap detection
      }
    : {
        transform: "translate(0, 0)",
        boxShadow: "none",
        zIndex: 1,
        pointerEvents: "auto"
      };

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="section-block"
      style={{
        left: left + "px",
        width: width + "px",
        height: "36px",
        fontSize: fontSize + "px",
        backgroundColor: colour,
        position: "absolute",
        ...liftStyle
      }}
    >
      {sectionName}
    </div>
  );
}
