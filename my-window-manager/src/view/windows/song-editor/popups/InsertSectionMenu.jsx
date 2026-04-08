import { useEffect, useRef, useState } from "react";
import "./popups.css";

export function InsertSectionMenu({ store }) {
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
    console.log("Recommend choice:", id);
  }

  function HandlePreExistingChoice(id) {
    const pos = store.selectors.sections.getSectionPosition(store.state.editor.currentPopupPosition, store.state)
    console.log(pos)
    store.actions.copySectionAtPos(id, pos);
    store.actions.setActiveAddPopup(false);
  }

  // -----------------------------
  //  CLICK OUTSIDE TO CLOSE
  // -----------------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        store.actions.setActiveInsertPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
              <div className="submenu-item">Create New Sequence</div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
