import "./blocks.css";
import {useRef, useState, useEffect} from "react"

export function EmptySectionBlock({ store, sectionID, startBeat, length }) {
  const beatWidth = store.state.editor.beatWidth;
  const zoom = store.state.editor.zoomLevel;

  // Width and left must both scale with zoom
  const width = length * beatWidth * zoom;
  const left = startBeat * beatWidth * zoom;

  // Optional: scale font size with width
  const fontSize = Math.max(10, zoom * 5);

  const ref = useRef(null);

  const [edge, setEdge] = useState(null); 
  // edge = "left" | "right" | null

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const threshold = 1; // px from edge

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const distLeft = e.clientX - rect.left;
      const distRight = rect.right - e.clientX;

      if (distLeft < threshold) {
        store.actions.setHoveredGap(startBeat);
      } else if (distRight < threshold) {
        store.actions.setHoveredGap(startBeat + length)
      } else {
        store.actions.setHoveredGap(null)
      }
    };

    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, [startBeat, length]);
  return (
    <div
      ref={ref}
      className="section-block"
      style={{
        left: left + "px",
        width: width + "px",
        height: "36px",
        fontSize: fontSize + "px",
        backgroundColor: "pink"

      }}
    >
    </div>
  );
}