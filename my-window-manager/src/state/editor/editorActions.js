

export const selectChord = (id) => (state, domain) => {
    state.editor.chordSelected = id;
    state.editor.sequenceSelected = null;
    state.editor.sectionSelected = null;
}
export const selectSequence = (id) => (state, domain) => {
    state.editor.chordSelected = null;
    state.editor.sequenceSelected = id;
    state.editor.sectionSelected = null;
}
export const selectSection = (id) => (state, domain) => {
    state.editor.chordSelected = null;
    state.editor.sequenceSelected = null;
    state.editor.sectionSelected = id;
}

export const hoverChord = (id) => (state, domain) => {
    state.editor.hoveredChordID = id;
}
export const hoverSequence = (id) => (state, domain) => {
    state.editor.hoveredSequenceID = id;
}
export const hoverSection = (id) => (state, domain) => {
    state.editor.hoveredSectionID = id;
}

export const setPlayheadPosition = (position) => (state, domain) => {
  state.editor.playheadPosition = position
}
export const setZoom = (newZoom) => (state) => {
  const editor = {...state.editor}
  editor.zoomLevel = newZoom;
  state.editor = editor;
}
export const scrollEditor = (x, y) => (state, domain) => {
  state.editor.scrollX = x
  state.editor.scrollY = y
}

export const startEditorDrag = (payload) => (state, domain) => {
  state.editor.mode = "dragging"
  state.editor.dragState = payload
}
export const updateDrag = (payload) => (state, domain) => {
  state.editor.dragState = payload
}
export const endEditorDrag = () => (state, domain) => {
  state.editor.mode = "idle"
  state.editor.dragState = null
}

export const setActiveEditor = (newEditor) => (state) => {
  const editor = {...state.editor};
  editor.activeEditor = newEditor;
  state.editor = editor;
}
