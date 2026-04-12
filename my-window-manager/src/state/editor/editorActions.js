

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
    console.log(newState)
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
        const songSpace = {beats: {}, objects: {}, secondsAtBeat: []}
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
    const songSpace = {beats: {}, objects: {}, secondsAtBeat: []}
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
        if(section.sequenceIDs.length === 0){
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

    let totalSeconds = 0;

    for (let beat = 0; beat < state.editor.endPosition; beat++) {
      const beatInfo = songSpace.beats[beat];
      const bpm = beatInfo.tempo;
      const spb = 60 / bpm;

      songSpace.secondsAtBeat.push(totalSeconds);
      totalSeconds += spb;
    }
    state.editor.songSpace = songSpace;
};



export const setSelectedSection = (sectionID) => (state) => {
  state.editor.selectedSectionID = sectionID;
  state.editor.selectedSectionIDs = [sectionID];
}

export const setSelectedSectionRange = (sectionIDs) => (state) =>{
  state.editor.selectedSectionIDs = sectionIDs;
}

export const setSelectedSequence = (sequenceID) => (state) =>{
  state.editor.selectedSequenceID = sequenceID;
  state.editor.selectedSequenceIDs = [sequenceID];
}

export const setSelectedSequenceRange = (sequenceIDs) => (state) => {
  state.editor.selectedSequenceIDs = sequenceIDs;
}

export const clearAllSelections = () => (state) => {
  state.editor.selectedSectionID = null;
  state.editor.selectedSectionIDs = [];
  state.editor.selectedSequenceID = null;
  state.editor.selectedSequenceIDs = [];
}


export const startSectionDrag = (mouseX, mouseY, sectionIDs) => (state) => {
  state.editor.drag = {
    active: true,
    started: false,
    startX: mouseX,
    startY: mouseY,
    offsetX: 0,
    offsetY: 0,
    sectionIDs
  };
}

export const updateSectionDrag = (mouseX, mouseY) => (state) => {
  const drag = state.editor.drag;
  if (!drag.active) return;

  const dx = mouseX - drag.startX;
  const dy = mouseY - drag.startY;

  // threshold: 3px in either direction
  if (!drag.started) {
    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
      return;
    }
    drag.started = true;
  }

  drag.offsetX = dx;
  drag.offsetY = dy;
}

export const endSectionDrag = () => (state) =>{
  state.editor.drag = {
    active: false,
    started: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    sectionIDs: []
  };
}

export const commitSectionDrag = () => (state, domain, actions) => {
  const editor = state.editor;
  const drag = editor.drag;

  if (!drag.active) return;

  const hoveredBeat = editor.hoveredGapPosition;

  if (hoveredBeat == null) {
    actions.endSectionDrag();
    return;
  }

  const songSpace = state.editor.songSpace;
  if (!songSpace || !songSpace.objects) return null;

  const entry = Object.entries(songSpace.objects)
    .find(([id, obj]) => obj.startBeat === hoveredBeat);

  let insertPos;

  if (entry) {
    insertPos = state.project.currentProject.songContents.indexOf(entry[0]);
  } else {
    insertPos = state.project.currentProject.songContents.length;
  }

  const project = state.project.currentProject;
  const contents = [...project.songContents];

  const draggedIDs = drag.sectionIDs;
  const draggedSet = new Set(draggedIDs);

  // ---------------------------------------------
  // FIX: adjust insertPos if dragging forward
  // ---------------------------------------------
  const firstDraggedIndex = contents.indexOf(draggedIDs[0]);

  if (insertPos > firstDraggedIndex) {
    insertPos -= draggedIDs.length;
  }

  // Remove dragged sections
  const remaining = contents.filter(id => !draggedSet.has(id));

  // Insert dragged block
  const before = remaining.slice(0, insertPos);
  const after = remaining.slice(insertPos);
  const newContents = [...before, ...draggedIDs, ...after];

  project.songContents = newContents;

  state.project.songVersion += 1;
  actions.updateSongSpaceFromState();
  actions.endSectionDrag();
};



export const startSequenceDrag = (mouseX, mouseY, sequenceIDs) => (state) => {
  state.editor.sequenceDrag = {
    active: true,
    started: false,
    startX: mouseX,
    startY: mouseY,
    offsetX: 0,
    offsetY: 0,
    sequenceIDs
  };
}

export const updateSequenceDrag = (mouseX, mouseY) => (state) => {
  const drag = state.editor.sequenceDrag;
  if (!drag.active) return;

  const dx = mouseX - drag.startX;
  const dy = mouseY - drag.startY;

  // 3px threshold
  if (!drag.started) {
    if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
    drag.started = true;
  }

  drag.offsetX = dx;
  drag.offsetY = dy;
}

export const endSequenceDrag = () => (state) => {
  state.editor.sequenceDrag = {
    active: false,
    started: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    sequenceIDs: []
  };
}

export const commitSequenceDrag = () => (state, domain, actions) => {
  const editor = state.editor;
  const drag = editor.sequenceDrag;

  if (!drag || !drag.active) return;

  const hoveredBeat = editor.hoveredGapPosition;

  if (hoveredBeat == null) {
    actions.endSequenceDrag();
    return;
  }

  const songSpace = state.editor.songSpace;
  if (!songSpace || !songSpace.objects) {
    actions.endSequenceDrag();
    return;
  }

  // Helper: find parent section of a sequence
  const getSequenceParent = (sequenceID) => {
    const sectionOrder = state.project.currentProject.songContents;
    for (const sectionID of sectionOrder) {
      const section = state.sections.byID[sectionID];
      if (section.sequenceIDs.includes(sequenceID)) {
        return sectionID;
      }
    }
    return null;
  };

  // ------------------------------------------------------------
  // 1. Determine target section + insertPos
  // ------------------------------------------------------------
  const seqEntry = Object.entries(songSpace.objects)
    .find(([id, obj]) =>
      obj.type === "sequence" &&
      obj.startBeat + obj.length === hoveredBeat
    );

  let targetSectionID = null;
  let insertPos = 0;

  if (seqEntry) {
    // Gap is AFTER an existing sequence
    const seqID = seqEntry[0];
    targetSectionID = getSequenceParent(seqID);
    if (!targetSectionID) {
      actions.endSequenceDrag();
      return;
    }

    const section = state.sections.byID[targetSectionID];
    const idx = section.sequenceIDs.indexOf(seqID);
    insertPos = idx + 1;

  } else {
    // Gap is inside a section → insert at end
    const sectionEntry = Object.entries(songSpace.objects)
      .find(([id, obj]) =>
        obj.type === "section" &&
        obj.startBeat <= hoveredBeat &&
        obj.startBeat + obj.length >= hoveredBeat
      );

    if (!sectionEntry) {
      actions.endSequenceDrag();
      return;
    }

    targetSectionID = sectionEntry[0];
    const section = state.sections.byID[targetSectionID];
    insertPos = section.sequenceIDs.length;
  }

  // ------------------------------------------------------------
  // 2. Move dragged sequences
  // ------------------------------------------------------------
  const draggedSeqIDs = drag.sequenceIDs;
  if (!draggedSeqIDs || draggedSeqIDs.length === 0) {
    actions.endSequenceDrag();
    return;
  }

  const targetSection = state.sections.byID[targetSectionID];
  const seqArr = targetSection.sequenceIDs;

  // ------------------------------------------------------------
  // FIX: adjust insertPos for forward moves inside same section
  // ------------------------------------------------------------
  const firstDraggedIndex = seqArr.indexOf(draggedSeqIDs[0]);

  if (firstDraggedIndex !== -1 && insertPos > firstDraggedIndex) {
    insertPos -= draggedSeqIDs.length;
  }

  // ------------------------------------------------------------
  // Remove dragged sequences from their parents
  // ------------------------------------------------------------
  for (const seqID of draggedSeqIDs) {
    const parentID = getSequenceParent(seqID);
    if (!parentID) continue;

    const arr = state.sections.byID[parentID].sequenceIDs;
    const idx = arr.indexOf(seqID);
    if (idx !== -1) arr.splice(idx, 1);
  }

  // ------------------------------------------------------------
  // Insert dragged sequences into target section
  // ------------------------------------------------------------
  const before = seqArr.slice(0, insertPos);
  const after = seqArr.slice(insertPos);

  targetSection.sequenceIDs = [...before, ...draggedSeqIDs, ...after];

  // ------------------------------------------------------------
  // 3. Rebuild + cleanup
  // ------------------------------------------------------------
  state.project.songVersion += 1;
  actions.updateSongSpaceFromState();
  actions.endSequenceDrag();
};


export const setPlayheadPosition = (beat) => (state) => {
  state.editor.playheadPosition = beat;
}
