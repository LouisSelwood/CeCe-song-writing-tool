import { useEffect, useRef, useState } from "react";
import "./popups.css";

export function AddSectionMenu({ store }) {
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

  const uniqueSections = store.selectors.sections.getUniqueSections(store.state);

  // -----------------------------
  //  HANDLERS (empty for now)
  // -----------------------------
  function HandleRecommendChoice(id) {
    store.actions.setActiveAddPopup(false);
  }

  function HandlePreExistingChoice(id) {
    store.actions.copySectionAtEnd(id);
    store.actions.setActiveAddPopup(false);
  }

  function HandleCreateNewSection() {
    console.log("PRessed")
    store.actions.addEmptySectionAtEnd();
    store.actions.setActiveAddPopup(false);
  }

  // -----------------------------
  //  CLICK OUTSIDE TO CLOSE
  // -----------------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        store.actions.setActiveAddPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
            {/* Invisible hover bridge */}
            <div
              className="submenu-bridge"
              style={{ top: 0 }}
              onMouseEnter={() => setOpenMenu("one")}
            />

            {/* Submenu */}
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
            {/* Invisible hover bridge */}
            <div
              className="submenu-bridge"
              style={{ top: 60 }}
              onMouseEnter={() => setOpenMenu("two")}
            />

            {/* Submenu */}
            <div
              className="submenu"
              style={{ top: 60 }}
              onMouseEnter={() => setOpenMenu("two")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              {Object.entries(uniqueSections).map(([name, id]) => (
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
            {/* Invisible hover bridge */}
            <div
              className="submenu-bridge"
              style={{ top: 120 }}
              onMouseEnter={() => setOpenMenu("three")}
            />

            {/* Submenu */}
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
