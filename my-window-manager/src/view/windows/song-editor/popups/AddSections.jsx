import "./popups.css"

export function AddSections({ store }) {
  const left =
    store.state.editor.endPosition *
    store.state.editor.beatWidth *
    store.state.editor.zoomLevel;

  const uniqueSections = store.selectors.sections.getUniqueSections(store.state);

  function AddSectionAtEnd(id){
    store.actions.copySectionAtEnd(id);
  }
  return (
    <div 
      className="add-section"
      style={{ left: left + 100 }}
    >
      <div className="title-bar">
          Add Section
      </div>
      <div
        className="section-name-container"
      >
        {Object.keys(uniqueSections).map((id) => (
          <div 
            key={id} 
            className="add-section-option"
            onMouseDown={() => AddSectionAtEnd(id)}
          >
            {uniqueSections[id]}
            
          </div>
        ))}
      </div>
    </div>
  );
}
