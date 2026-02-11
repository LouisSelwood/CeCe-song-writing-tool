export const editorInitialState = {
    //single select state
    chordSelected: null,
    sequenceSelected: null,
    sectionSelected: null,

    //multiselect state
    selectedChordIDs: [],
    selectedSequenceIDs: [],
    selectedSectionIDs: [],

    activeEditor: null,  //holds current window active (sequence, section, song editor)
    activeTool: "selector",

    //cursor hover state
    hoveredChordID: null,
    hoveredSequenceID: null,
    hoveredSectionID: null,

    //Song timeline navigation state
    playheadPosition: 0,       // in beats
    zoomLevel: 1,              // 1 = 100%
    scrollX: 0,
    scrollY: 0,

    // Panels / UI layout
    leftPanelOpen: true,
    rightPanelOpen: false,
    bottomPanelOpen: false,
    inspectorOpen: false,

    // Editor modes
    mode: "idle",              // "idle", "editing", "dragging", "resizing"
    dragState: null,           // holds data during drag operations

    // History navigation (undo/redo)
    historyIndex: 0

}