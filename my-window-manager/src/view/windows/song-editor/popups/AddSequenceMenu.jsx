import { useEffect, useRef, useState } from "react";
import "./sequencePopups.css";

export function AddSequenceMenu({ store }) {
  const popupRef = useRef(null);

  const left =
    store.state.editor.currentPopupPosition *
    store.state.editor.zoomLevel *
    store.state.editor.beatWidth;

  const [openMenu, setOpenMenu] = useState(null);

  // -----------------------------
  //  DICTIONARIES
  // -----------------------------
  const recommendations = {
    "Recommended A": "recA",
    "Recommended B": "recB",
    "Recommended C": "recC",
    "Recommended D": "recD",
  };

  // Pre-existing sequences must come from the section at this position
  const sequenceID =
    store.selectors.sequences.getSequenceAtPosition(
      store.state.editor.currentPopupPosition,
      store.state
    );

  const sectionID =
    store.selectors.sequences.getSequenceParent(store.state, sequenceID);

  const uniqueSequences =
    store.selectors.sequences.getUniqueSequences(sectionID, store.state);

  // -----------------------------
  //  HANDLERS (now fully implemented)
  // -----------------------------
  function HandleRecommendChoice(id) {
    console.log("Recommend choice:", id);
    store.actions.setActiveAddPopup(false);
  }

  function HandlePreExistingChoice(id) {
    // Find the sequence position inside the section
    const pos =
      store.selectors.sequences.getSequencePosition(
        store.state.editor.currentPopupPosition,
        store.state
      );

    const seqID =
      store.selectors.sequences.getSequenceAtPosition(
        store.state.editor.currentPopupPosition,
        store.state
      );

    const parentSection =
      store.selectors.sequences.getSequenceParent(store.state, seqID);

    // Insert AFTER the sequence at this gap
    store.actions.copySequenceAtPos(parentSection, id, pos + 1);

    store.actions.setActiveAddPopup(false);
  }

  function HandleCreateNewSection() {
    console.log("Pressed");

    // Insert a new empty sequence at the end of the section
    const seqID =
      store.selectors.sequences.getSequenceAtPosition(
        store.state.editor.currentPopupPosition,
        store.state
      );

    const parentSection =
      store.selectors.sequences.getSequenceParent(store.state, seqID);

    const pos =
      store.selectors.sequences.getSequencePosition(
        store.state.editor.currentPopupPosition,
        store.state
      );

    // Add new empty sequence AFTER this position
    store.actions.addEmptySequenceAtPos(parentSection, pos + 1);

    store.actions.setActiveAddPopup(false);
  }

  // -----------------------------
  //  CLICK OUTSIDE TO CLOSE
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      function handleClickOutside(e) {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
          store.actions.setActiveAddPopup(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={popupRef}
      className="add-section"
      style={{ left: left + 100 }}
    >
      <div className="button-stack">

        {/* BUTTON 1 — RECOMMENDATIONS */}
        <div
          className="popup-btn"
          onMouseEnter={() => setOpenMenu("one")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          R
        </div>

        {openMenu === "one" && (
          <>
            <div
              className="submenu-bridge"
              style={{ top: 0 }}
              onMouseEnter={() => setOpenMenu("one")}
            />

            <div
              className="submenu"
              style={{ top: 0 }}
              onMouseEnter={() => setOpenMenu("one")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              {Object.entries(recommendations).map(([name, id]) => (
                <div
                  key={id}
                  className="submenu-item"
                  onMouseDown={() => HandleRecommendChoice(id)}
                >
                  {name}
                </div>
              ))}
            </div>
          </>
        )}

        {/* BUTTON 2 — PRE-EXISTING */}
        <div
          className="popup-btn"
          onMouseEnter={() => setOpenMenu("two")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          P
        </div>

        {openMenu === "two" && (
          <>
            <div
              className="submenu-bridge"
              style={{ top: 60 }}
              onMouseEnter={() => setOpenMenu("two")}
            />

            <div
              className="submenu"
              style={{ top: 60 }}
              onMouseEnter={() => setOpenMenu("two")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              {Object.entries(uniqueSequences).map(([name, id]) => (
                <div
                  key={id}
                  className="submenu-item"
                  onMouseDown={() => HandlePreExistingChoice(id)}
                >
                  {name}
                </div>
              ))}
            </div>
          </>
        )}

        {/* BUTTON 3 — CREATE NEW */}
        <div
          className="popup-btn"
          onMouseEnter={() => setOpenMenu("three")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          C
        </div>

        {openMenu === "three" && (
          <>
            <div
              className="submenu-bridge"
              style={{ top: 120 }}
              onMouseEnter={() => setOpenMenu("three")}
            />

            <div
              className="submenu"
              style={{ top: 120 }}
              onMouseEnter={() => setOpenMenu("three")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <div
                className="submenu-item"
                onMouseDown={() => HandleCreateNewSection()}
              >
                Create New Sequence
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
