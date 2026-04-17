import { useEffect, useRef, useState } from "react";
import "./sequencePopups.css";
import repeatIcon from "../../../../assets/icons/repeat.png"
import addIcon from "../../../../assets/icons/add.png"


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

  function HandleCreateNewSequence() {
    console.log("PRessed")
    const prevSequence = store.selectors.sequences.getSequenceAtPosition(store.state.editor.currentPopupPosition, store.state)
    const sectionID = store.selectors.sequences.getSequenceParent(store.state, prevSequence)
    const pos = store.selectors.sequences.getSequencePosition(store.state.editor.currentPopupPosition, store.state)
    store.actions.addEmptySequenceAtPos(sectionID, prevSequence, pos);
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
        {/* BUTTON 2 — PRE-EXISTING */}
        <div
          className="popup-btn"
          onMouseEnter={() => setOpenMenu("two")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <img src={repeatIcon} alt="repeat" style={{height: "60%", width: "60%"}}/>
        </div>

        {openMenu === "two" && (
          <>
            <div
              className="submenu-bridge-top"
              style={{ left: 0 }}
              onMouseEnter={() => setOpenMenu("two")}
            />

            <div
              className="submenu-top"
              style={{ left: 0 }}
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
          <img src={addIcon} alt="add" style={{height: "60%", width: "60%"}}/>
        </div>

        {openMenu === "three" && (
          <>
            <div
              className="submenu-bridge-top"
              style={{ left: 60 }}
              onMouseEnter={() => setOpenMenu("three")}
            />

            <div
              className="submenu-top"
              style={{ left: 60 }}
              onMouseEnter={() => setOpenMenu("three")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <div 
                className="submenu-item"
                onMouseDown={()=>HandleCreateNewSequence()}
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
