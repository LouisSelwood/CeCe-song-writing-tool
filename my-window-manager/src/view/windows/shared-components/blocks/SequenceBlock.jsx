import "./blocks.css";
import {useState, useRef, useEffect} from "react"
export function SequenceBlock({ store, sequenceID, startBeat, length }) {
  const beatWidth = store.state.editor.beatWidth;
  const zoom = store.state.editor.zoomLevel;

  // Width and left must both scale with zoom
  const width = length * beatWidth * zoom;
  const left = startBeat * beatWidth * zoom;

  // Optional: scale font size with width
  const fontSize = Math.max(10, zoom * 5);
  const contents = store.selectors.sequences.getChordsAsNotation(store.state, sequenceID)

  const ref = useRef(null);
  
  const [edge, setEdge] = useState(null); 
  // edge = "left" | "right" | null

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const threshold = 12; // px from edge

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
  }, []);
  return (
    <div
      className="sequence-block"
      style={{
        left: left + "px",
        width: width + "px",
        height: "100px",
        fontSize: fontSize + "px"
      }}
      ref={ref}
    >

      {contents.map((content, index) => (
        <div key={index} style={{
          display: "flex", 
          width: content.length * store.state.editor.beatWidth * store.state.editor.zoomLevel, 
          justifyContent: "center", border: "1px dotted blue", height: "100%", alignItems: "center"}}
        > 
          {content.name}
        </div>
      ))}



    </div>
  );
}