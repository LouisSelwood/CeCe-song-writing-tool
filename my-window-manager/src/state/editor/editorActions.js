

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

export const updateScrollPosition = (newPosition) => (state) => {
    const editor = state.editor;
    editor.scrollPosition = newPosition;
    state.editor = editor
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

export const setHoveredGap = (pos) => (state) => {
    const editor = {...state.editor}
    editor.hoveredGapPosition = pos;
    state.editor = editor;
}

export const setActiveAddPopup = (newState) => (state) => {
    let popupActive = null;
    if(newState){
        if(state.editor.activeEditor === "song"){
            popupActive = "AddSection";
        }
        else{
            popupActive = "AddSequence";
        }
    }else{
        state.editor.currentPopupPosition = null;
    }
    state.editor.popupActive = popupActive;

}

export const setActiveInsertPopup = (newState) => (state) => {
    let popupActive = null;
    if(newState){
        if(state.editor.activeEditor === "song"){
            popupActive = "InsertSection";
        }
        else{
            popupActive = "InsertSequence";
        }
    }else{
        state.editor.currentPopupPosition = null;
    }
    state.editor.popupActive = popupActive;
}

export const setPopupPosition = (barPosition) => (state) => {
    state.editor.currentPopupPosition = barPosition;
    console.log(state.editor.currentPopupPosition)
}
export const checkValidEditor = (screenWidth, average) => (state) => {
    if(state.editor.autoSwitch){
        const editor = { ...state.editor };
        const sequenceWidth = average.sequence * editor.beatWidth * editor.zoomLevel;
        const sectionWidth = average.section * editor.beatWidth * editor.zoomLevel;

        if (sectionWidth < screenWidth) {
            editor.activeEditor = "song";
        } else if (sequenceWidth > screenWidth) {
            editor.activeEditor = "sequence";
        } else {
            editor.activeEditor = "section";
        }
        state.editor = editor;
        }
    
}
export const updateSongSpaceFromState = () => (state) => {
    if(state.project.currentProject.songContents.length === 0){
        const songSpace = {beats: {}, objects: {}}
        let time = 0;
        for (let i = 0; i <= 200; i++) {
            songSpace.beats[i] = {
                barStart: i % 4 === 0,
                tempo: 80,
                keySignature: null,
                timeSignature: {numerator: 4, denominator: 4},
                rhythm: null,
                time: {
                    min: Math.round(time / 60), 
                    sec: Math.round(time % 60)},
                objects: {}
            };
            time += 60/80;
        }
        state.editor.songSpace = songSpace
        return;
    }
    const songSpace = {beats: {}, objects: {}}
    const song = state.project.currentProject.songContents;
    let currentBeat = 0;
    let currentTime = 0;
    let beatsIntoBar = 0;
    let lastTempo = null;
    let lastTs = null;

    song.forEach((sectionID) => { 
        const section = state.sections.byID[sectionID];
        songSpace.objects[section.id] = {
            type: "section",
            startBeat: currentBeat,
        };
        console.log(`${section.name}: ${section.sequenceIDs}`)
        if(section.sequenceIDs.length === 0){
            console.log(section.name)
            songSpace.objects[section.id] = {
                type: "emptySection",
                startBeat: currentBeat,
                length: 4,
            };

            const time = {
                min: Math.floor(currentTime / 60),
                sec: Math.floor(currentTime % 60)
            };
            for(let i=0; i < 4; i++){
                songSpace.beats[currentBeat] = {
                    barStart: false,
                    tempo: null,
                    keySignature: null,
                    timeSignature: null,
                    rhythm: null,
                    time,
                    objects: {
                        section: section.id,
                        sequence: null,
                        chord: null,
                    }
                }
                currentBeat++;
            }
        }else{
            section.sequenceIDs.forEach((sequenceID) => {
                const sequence = state.sequences.byID[sequenceID];
                
                songSpace.objects[sequence.id] = {
                    type: "sequence",
                    startBeat: currentBeat,
                };

                sequence.chordIDs.forEach((chordID) => {
                    const chord = state.chords.byID[chordID];
                    const chordLength = chord.duration * sequence.timeSignature.numerator;

                    songSpace.objects[chord.id] = {
                        type: "chord",
                        startBeat: currentBeat,
                        length: chordLength,
                    };

                    for (let i = 0; i < chordLength; i++) {
                        const ts = sequence.timeSignature;
                        const isBarStart = beatsIntoBar === 0;

                        const time = {
                            min: Math.floor(currentTime / 60),
                            sec: Math.floor(currentTime % 60)
                        };

                        songSpace.beats[currentBeat] = {
                            barStart: isBarStart,
                            tempo: sequence.tempo,
                            keySignature: sequence.keySignature,
                            timeSignature: ts,
                            rhythm: sequence.rhythm,
                            time,
                            objects: {
                                section: section.id,
                                sequence: sequence.id,
                                chord: chord.id,
                            }
                        };

                        beatsIntoBar += 1;
                        if (beatsIntoBar === ts.numerator) beatsIntoBar = 0;

                        currentBeat += 1;
                        currentTime += 60 / sequence.tempo;
                        lastTempo = sequence.tempo;
                        lastTs = sequence.timeSignature
                    }
                });

                songSpace.objects[sequence.id].length =
                    currentBeat - songSpace.objects[sequence.id].startBeat;
            });
            songSpace.objects[section.id].length =
            currentBeat - songSpace.objects[section.id].startBeat;
        }

    
    });
    state.editor.endPosition = currentBeat
    currentBeat += 1;
    
    
    for (let i = 0; i <= 200; i++) {
        songSpace.beats[currentBeat + i] = {
            barStart: i % 4 === 0,
            tempo: lastTempo,
            keySignature: null,
            timeSignature: lastTs,
            rhythm: null,
            time : {
                min: Math.round(currentTime / 60), 
                sec: Math.round(currentTime % 60)},
            objects: {}
        };
        currentTime += 60 / lastTempo;
    }

    state.editor.songSpace = songSpace;
};


export const updateStateFromSongSpace = () => (state) => {

}



