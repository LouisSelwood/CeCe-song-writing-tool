import { useMemo } from "react";
import "./editingMenu.css";
import copyIcon from "../../../../assets/icons/copy.png"
import deleteIcon from "../../../../assets/icons/delete.png"

export function EditingMenu({ store }) {
  if(store.state.editor.drag.active) {return};
  const editor = store.state.editor;
  const selected = editor.selectedSectionIDs;

  // No selection → no menu

  const beatWidth = editor.beatWidth;
  const zoom = editor.zoomLevel;

  const { minLeft, maxRight } = store.selectors.sections.getSelectedSectionsBounds(store.state);
  if (minLeft === null || maxRight === null) return null;

  const centerX = ((minLeft + maxRight) / 2) * beatWidth * zoom;
  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------
  function handleDelete() {
    store.actions.deleteSelectedSections();
  }

  function handleDuplicate() {
    store.actions.duplicateSelectedSections();
  }

  function handleArchive() {
    for (const id of selected) {
      store.actions.archiveSection(id);
    }
  }

  return (
    <div
      className="editing-menu"
      style={{
        left: centerX, // menu width ~150px
        top: top,
      }}
    >
      <div className="edit-btn" onMouseDown={handleDelete}>
        <img src={deleteIcon} alt="delete" style={{height: "60%", width: "60%"}}/>
      </div>
      <div className="edit-btn" onMouseDown={handleDuplicate}>
        <img src={copyIcon} alt="copy" style={{height: "60%", width: "60%"}}/>
      </div>
    </div>
  );
}
