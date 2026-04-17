export const editorInitialState = {
    songSpace: null,
    endPosition: null,

    drag: {
        active: false,
        started: false,        // passed threshold
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        sectionIDs: []         // sections being visually dragged
    },

    sequenceDrag: {
        active: false,
        started: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        sequenceIDs: []
    },
    //single select state
    selectedChordID: null,
    selectedSequenceID: null,
    selectedSectionID: null,

    selectedSequenceIDPrevState: null,

    //multiselect state
    selectedChordIDs: [],
    selectedSequenceIDs: [],
    selectedSectionIDs: [],

    activeEditor: "song",  //holds current window active (sequence, section, song editor)
    activeTool: "selector",
    autoSwitch: false,
    popupActive: null,
    currentPopupPosition: null,

    sectionColours: {
        verse:      "#D6C5B0",
        prechorus:  "#A6A5AA",
        chorus:     "#BDA5A1",
        postchorus: "#A6C5BD",
        bridge:     "#B1BFCD",
        breakdown:  "#CCE3D3",
        outro:      "#D9D3B6",
        intro:      "#C0B1C1"
        },

    //cursor hover state
    hoveredGapPosition: null,
    hoveredChordID: null,
    hoveredSequenceID: null,
    hoveredSectionID: null,

    //Song timeline navigation state
    playheadPosition: 0,       // in beats
    zoomStrength: 0.08,
    zoomLevel: 1,              // 1 = 100%
    scrollPosition: 0,

    beatWidth: 20,


    // History navigation (undo/redo)
    historyIndex: 0

}