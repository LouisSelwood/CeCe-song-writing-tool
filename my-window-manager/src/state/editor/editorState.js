export const editorInitialState = {
    songSpace: null,
    endPosition: null,
    //single select state
    chordSelected: null,
    sequenceSelected: null,
    sectionSelected: null,

    //multiselect state
    selectedChordIDs: [],
    selectedSequenceIDs: [],
    selectedSectionIDs: [],

    activeEditor: "song",  //holds current window active (sequence, section, song editor)
    activeTool: "selector",
    autoSwitch: true,
    popupActive: null,


    //cursor hover state
    hoveredGapPosition: null,
    hoveredChordID: null,
    hoveredSequenceID: null,
    hoveredSectionID: null,

    //Song timeline navigation state
    playheadPosition: 0,       // in beats
    zoomStrength: 0.05,
    zoomLevel: 1,              // 1 = 100%
    scrollPosition: 0,

    beatWidth: 20,


    // History navigation (undo/redo)
    historyIndex: 0

}