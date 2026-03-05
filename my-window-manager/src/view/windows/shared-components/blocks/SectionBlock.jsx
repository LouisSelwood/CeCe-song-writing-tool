import "./blocks.css";
export function SectionBlock({store, sectionID}) {
    const width = (store.selectors.sections.getSectionWidth(store.state, sectionID) * store.state.editor.beatWidth * store.state.editor.zoomLevel) ;
    const fontSize = Math.max(10, width * 0.1);
    return(
        <div className="section-block" style={{height: "100px", width: width + "px", fontSize}}>
            {store.state.sections.byID[sectionID].name}
        </div>
    );
}