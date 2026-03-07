

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

export const checkValidEditor = (screenWidth, average) => (state) => {
    const editor = { ...state.editor };
    const sequenceWidth = average.sequence * editor.beatWidth * editor.zoomLevel;
    const sectionWidth = average.section * editor.beatWidth * editor.zoomLevel;
    console.log(`Section: ${sectionWidth}`);
    console.log(`Sequence: ${sequenceWidth}`);
    console.log(`screen: ${screenWidth}`)

    if (sectionWidth < screenWidth) {
        editor.activeEditor = "song";
    } else if (sequenceWidth > screenWidth) {
        editor.activeEditor = "sequence";
    } else {
        editor.activeEditor = "section";
    }
    state.editor = editor;
}
export const updateSongSpaceFromState= () => (state) => {
    const songSpace = {beats: {}, objects: {}}

    const song = state.project.currentProject.songContents;
    let currentBeat = 0;
    let beatsIntoBar = 0;
    song.forEach((sectionID) => { 
        const section = state.sections.byID[sectionID];
        songSpace.objects[section.id] = {
            type: "section",
            startBeat: currentBeat,
        }
        section.sequenceIDs.forEach((sequenceID) => {
            const sequence = state.sequences.byID[sequenceID];
            songSpace.objects[sequence.id] = {
                type: "sequence",
                startBeat: currentBeat,
            }
            sequence.chordIDs.forEach((chordID) => {
                const chord = state.chords.byID[chordID];
                songSpace.objects[chord.id] = {
                    type: "chord",
                    startBeat: currentBeat,
                    length: chord.duration * sequence.timeSignature.numerator,
                }

                for (let i = 0; i < (chord.duration * sequence.timeSignature.numerator); i++) {
                    const ts = sequence.timeSignature;
                    const isBarStart = beatsIntoBar === 0;

                    songSpace.beats[currentBeat] = {
                        barStart: isBarStart,
                        tempo: sequence.tempo,
                        keySignature: sequence.keySignature,
                        timeSignature: ts,
                        rhythm: sequence.rhythm,
                        objects: {
                            section: section.id,
                            sequence: sequence.id,
                            chord: chord.id,
                        }
                    };

                    // advance counters
                    beatsIntoBar += 1;

                    // if we reached the bar length, reset
                    if (beatsIntoBar === ts.numerator) {
                        beatsIntoBar = 0;
                    }

                    currentBeat += 1;
                }

            })
            songSpace.objects[sequence.id].length = currentBeat - songSpace.objects[sequence.id].startBeat;
        })
        songSpace.objects[section.id].length = currentBeat - songSpace.objects[section.id].startBeat;
    })
    state.editor.songSpace = songSpace;
}

export const updateStateFromSongSpace = () => (state) => {

}



