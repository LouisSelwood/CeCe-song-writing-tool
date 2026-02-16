export const selectSelectedChordID = (state) => state.editor.chordSelected;
export const selectSelectedSequenceID = (state) => state.editor.sequenceSelected;
export const selectSelectedSectionID = (state) => state.editor.sectionSelected;

export const selectActiveEditor = (state) => state.editor.activeEditor;
export const selectActiveTool = (state) => state.editor.activeTool;

export const selectHoveredChordID = (state) => state.editor.hoveredChordID;
export const selectHoveredSequenceID = (state) => state.editor.hoveredSequenceID;
export const selectHoveredSectionID = (state) => state.editor.hoveredSectionID;

export const selectPlayheadPosition = (state) => state.editor.playheadPosition;
export const selectZoomLevel = (state) => state.editor.zoomLevel;
export const selectScroll = (state) => ({'x': state.editor.scrollX, 'y': state.editor.scrollY});

export const selectEditorMode = (state) => state.editor.mode;
export const selectDragState = (state) => state.editor.dragState;






