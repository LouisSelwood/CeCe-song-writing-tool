export const workshopInitialState = {
    songSpace: null,
    scrollX: 0,
    zoomLevel: 0.8,
    selectedChordID: null,
    selectedChordIDs: [],
    chordDrag: {
        active: false,
        started: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        chordIDs: []  
    }, // chords being visually dragged

    chordResize: {
        active: false,
        started: false,
        chordID: null,
        startX: 0,
        originalDuration: 0
    },
    hoveredChordResizeID: null,
    hoveredGapPosition: null,
    newChordPos: null,
    newChordSelected: {
        startBeat: null,
        durationBeats: null,
        bass: null,
        chordName: null,
        quality: null,
        root: null,
        chordName: null,
    },
    newChordLength: 0,
    recommendedChordData: null,

}