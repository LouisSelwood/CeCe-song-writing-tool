import { useEffect, useRef, useState } from "react";
import "./sequencePopups.css";

export function InsertSequenceMenu({ store }) {
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

  const sequenceID = store.selectors.sequences.getSequenceAtPosition(store.state.editor.currentPopupPosition, store.state)
  const sectionID = store.selectors.sequences.getSequenceParent(store.state, sequenceID)
  const uniqueSequences = store.selectors.sequences.getUniqueSequences(sectionID, store.state)

  // -----------------------------
  //  HANDLERS (empty for now)
  // -----------------------------
  function HandleRecommendChoice(id) {
    console.log("Recommend choice:", id);
  }

  function HandlePreExistingChoice(id) {
    const pos = store.selectors.sequences.getSequencePosition(store.state.editor.currentPopupPosition, store.state);
    const sequenceID = store.selectors.sequences.getSequenceAtPosition(store.state.editor.currentPopupPosition, store.state)
    const sectionID = store.selectors.sequences.getSequenceParent(store.state, sequenceID)
    console.log(store.state.sections.byID[sectionID].name)
    console.log(store.state.sequences.byID[sequenceID])
    console.log(pos)
    store.actions.copySequenceAtPos(sectionID, id, pos+1)
  
    store.actions.setActiveAddPopup(false);
  }

  function HandleCreateNewSection() {
    console.log("PRessed")
    const pos = store.selectors.sections.getSectionPosition(store.state.editor.currentPopupPosition, store.state)
    store.actions.addEmptySectionAtPos(pos);
    store.actions.setActiveAddPopup(false);
  }

  // -----------------------------
  //  CLICK OUTSIDE TO CLOSE
  // -----------------------------
  useEffect(() => {
    // Delay attaching the listener so the opening click doesn't close it
    const timer = setTimeout(() => {
      function handleClickOutside(e) {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
          store.actions.setActiveInsertPopup(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);

      // Cleanup
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={popupRef}
      className="add-section-top"
      style={{ left }}
    >
      <div className="button-row">

        {/* BUTTON 1 — RECOMMENDED */}
        <div
          className="popup-btn"
          onMouseEnter={() => setOpenMenu("one")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          R
        </div>

        {openMenu === "one" && (
          <>
            {/* Invisible hover bridge */}
            <div
              className="submenu-bridge-top"
              style={{ left: 0 }}
              onMouseEnter={() => setOpenMenu("one")}
            />

            {/* Submenu ABOVE */}
            <div
              className="submenu-top"
              style={{ left: 0 }}
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
              className="submenu-bridge-top"
              style={{ left: 60 }}
              onMouseEnter={() => setOpenMenu("two")}
            />

            <div
              className="submenu-top"
              style={{ left: 60 }}
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
              className="submenu-bridge-top"
              style={{ left: 120 }}
              onMouseEnter={() => setOpenMenu("three")}
            />

            <div
              className="submenu-top"
              style={{ left: 120 }}
              onMouseEnter={() => setOpenMenu("three")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <div 
                className="submenu-item"
                onMouseDown={()=>HandleCreateNewSection()}
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
