import "./editingMenu.css";

export function EditingMenu({ store }) {
  if(store.state.editor.sequenceDrag.active) {return};
  const editor = store.state.editor;

  const beatWidth = editor.beatWidth;
  const zoom = editor.zoomLevel;
  // You will implement this selector:
  // getSelectedSequencesBounds(state) → { minLeft, maxRight }
  const { minLeft, maxRight } =
    store.selectors.sequences.getSelectedSequencesBounds(store.state);

  if (minLeft === null || maxRight === null) return null;

  // Center point in pixels
  const centerX = ((minLeft + maxRight) / 2) * beatWidth * zoom;

  // You can adjust this depending on your sequence lane height

  // Selected sequences (single or multi)
  const selected = editor.selectedSequenceIDs;

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------
  function handleDelete() {
    store.actions.deleteSelectedSequences();
  }

  function handleDuplicate() {
    store.actions.duplicateSelectedSequences();
  }

  function handleArchive() {
    for (const id of selected) {
      store.actions.archiveSequence(id);
    }
  }

  return (
    <div
      className="editing-menu"
      style={{
        left: centerX,
        bottom: "80px",
      }}
    >
      <div className="edit-btn" onMouseDown={handleDelete}>E</div>
      <div className="edit-btn" onMouseDown={handleDuplicate}>F</div>
      <div className="edit-btn" onMouseDown={handleArchive}>G</div>
    </div>
  );
}
