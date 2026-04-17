export const setSequenceTempo = (sequenceID, newTempo) => (state) => {
    state.sequences.byID[sequenceID].tempo = newTempo;
    state.project.songVersion++;
}

export const setSequenceTimeSignature = (sequenceID, newTimeSignature) => (state) => {
    state.sequences.byID[sequenceID].timeSignature = newTimeSignature;
    state.project.songVersion++;
}

export const setSequenceKeySignature = (sequenceID, newKeySignature) => (state) => {
    state.sequences.byID[sequenceID].keySignature = newKeySignature;
    state.project.songVersion++;
}

export const updateWorkshopFromSongSpace = () => (state) => {
    const seqID = state.editor.selectedSequenceID;
    if (!seqID) {
        state.workshop.songSpace = null;
        return;
    }

    const sequence = state.sequences.byID[seqID];
    if (!sequence) {
        state.workshop.songSpace = null;
        return;
    }

    const tempo = sequence.tempo;
    const timeSig = sequence.timeSignature;
    const beatsPerBar = timeSig.numerator;
    const newChordPos = state.workshop.newChordPos;

    let beats = {};
    let objects = {};
    let currentBeat = 0;
    let beatsIntoBar = 0;
    if(sequence.chordIDs.length === 0 && state.workshop.newChordPos !== null){
        const newLength = timeSig.numerator;
        state.workshop.newChordLength = newLength;
        state.workshop.newChordSelected.startBeat = currentBeat;
        state.workshop.newChordSelected.durationBeats = newLength;
        for(let i = 0; i < newLength; i++){
            beats[currentBeat] = {
                beat: currentBeat,
                barStart: (currentBeat % timeSig.numerator) === 0,
                chordID: "newChord",
                tempo,
                keySignature: sequence.keySignature,
                timeSignature: timeSig,
            };
            currentBeat++;
        }
    }
    for (const chordID of sequence.chordIDs) {
        const chord = state.chords.byID[chordID];
        if (!chord) continue;

        const durationBeats = chord.duration * beatsPerBar;

        
        objects[chord.id] = {
            id: chord.id,
            startBeat: currentBeat,
            durationBeats
        };

        const endBeat = currentBeat + durationBeats;
        while (currentBeat < endBeat) {
            const isBarStart = currentBeat % timeSig.numerator === 0;

            beats[currentBeat] = {
                beat: currentBeat,
                barStart: isBarStart,
                chordID,
                tempo,
                keySignature: sequence.keySignature,
                timeSignature: timeSig,
            };

            // advance bar counter
            beatsIntoBar += 1;
            if (beatsIntoBar === beatsPerBar) beatsIntoBar = 0;

            currentBeat += 1;
        }
        if(currentBeat === newChordPos){
            const newLength = durationBeats;
            state.workshop.newChordLength = newLength;
            state.workshop.newChordSelected.startBeat = currentBeat;
            state.workshop.newChordSelected.durationBeats = newLength;
            for(let i = 0; i < newLength; i++){
                beats[currentBeat] = {
                    beat: currentBeat,
                    barStart: (currentBeat % timeSig.numerator) === 0,
                    chordID: "newChord",
                    tempo,
                    keySignature: sequence.keySignature,
                    timeSignature: timeSig,
                };
                currentBeat++;
            }
        }
    }

    // secondsAtBeat
    const spb = 60 / tempo;
    const secondsAtBeat = [];
    for (let i = 0; i <= currentBeat; i++) {
        secondsAtBeat.push(i * spb);
    }


    state.workshop.songSpace = {
        beats,
        objects,
        secondsAtBeat,
        tempo,
        timeSig,
        totalBeats: currentBeat
    };

};

export const setWorkshopZoom = (zoom) => (state) => {
    state.workshop.zoom = Math.max(0.2, Math.min(zoom, 8));
}

export const setWorkshopScroll = (scrollX) => (state) => {
    state.workshop.scrollX = Math.max(0, scrollX);
};



export const startChordDrag = (mouseX, mouseY, chordIDs) => (state) => {
  state.workshop.chordDrag = {
    active: true,
    started: false,
    startX: mouseX,
    startY: mouseY,
    offsetX: 0,
    offsetY: 0,
    chordIDs
  };
}

export const updateChordDrag = (mouseX, mouseY) => (state) => {
  const drag = state.workshop.chordDrag;
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

export const endChordDrag = () => (state) => {
  state.workshop.chordDrag = {
    active: false,
    started: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    chordIDs: []
  };
}

export const commitChordDrag = () => (state, domain, actions) => {
    const workshop = state.workshop;
    const drag = workshop.chordDrag;

    if (!drag || !drag.active) return;

    const hoveredBeat = workshop.hoveredGapPosition;

    // No valid drop target → revert
    if (hoveredBeat == null) {
        actions.endChordDrag();
        return;
    }

    const songSpace = workshop.songSpace;
    if (!songSpace || !songSpace.objects) {
        actions.endChordDrag();
        return;
    }

    // -----------------------------------------------------
    // 1. Find the chord object at hoveredBeat (if any)
    // -----------------------------------------------------
    const entry = Object.entries(songSpace.objects)
        .find(([id, obj]) => obj.startBeat === hoveredBeat);

    const sequenceID = state.editor.selectedSequenceID;
    if (!sequenceID) {
        actions.endChordDrag();
        return;
    }

    const sequence = state.sequences.byID[sequenceID];
    if (!sequence) {
        actions.endChordDrag();
        return;
    }

    const chordIDs = [...sequence.chordIDs]; // original order
    const draggedIDs = drag.chordIDs;
    const draggedSet = new Set(draggedIDs);

    // -----------------------------------------------------
    // 2. Determine insertion index inside the sequence
    // -----------------------------------------------------
    let insertPos;

    if (entry) {
        // Insert before the chord whose startBeat matches hoveredBeat
        insertPos = chordIDs.indexOf(entry[0]);
    } else {
        // Insert at end
        insertPos = chordIDs.length;
    }

    // -----------------------------------------------------
    // 3. Adjust insertPos if dragging forward (same as sections)
    // -----------------------------------------------------
    const firstDraggedIndex = chordIDs.indexOf(draggedIDs[0]);

    if (insertPos > firstDraggedIndex) {
        insertPos -= draggedIDs.length;
    }

    // -----------------------------------------------------
    // 4. Remove dragged chords from the sequence
    // -----------------------------------------------------
    const remaining = chordIDs.filter(id => !draggedSet.has(id));

    // -----------------------------------------------------
    // 5. Insert dragged chords at new position
    // -----------------------------------------------------
    const before = remaining.slice(0, insertPos);
    const after = remaining.slice(insertPos);
    const newChordOrder = [...before, ...draggedIDs, ...after];

    sequence.chordIDs = newChordOrder;

    // -----------------------------------------------------
    // 6. Rebuild workshop songSpace
    // -----------------------------------------------------
    actions.updateWorkshopFromSongSpace();
    state.project.songVersion++;

    // -----------------------------------------------------
    // 7. End drag
    // -----------------------------------------------------
    actions.endChordDrag();
};


export const setSelectedChord = (chordID) => (state) => {
    state.workshop.selectedChordID = chordID;
}


export const setSelectedChordRange = (chordIDs) => (state) => {
    state.workshop.selectedChordIDs = chordIDs;
    
}

export const setChordHoveredGapPosition = (hoveredGap) => (state) => {
    state.workshop.hoveredGapPosition = hoveredGap;
}


export const deleteSelectedChords = () => (state, domain, actions) => {
    const seqID = state.editor.selectedSequenceID;
    if (!seqID) return;

    const sequence = state.sequences.byID[seqID];
    if (!sequence) return;

    const selected = state.workshop.selectedChordIDs;
    if (!selected || selected.length === 0) return;

    const selectedSet = new Set(selected);

    // Remove chords from the sequence order
    sequence.chordIDs = sequence.chordIDs.filter(id => !selectedSet.has(id));

    // Remove chord objects from workshop songSpace
    for (const chordID of selected) {
        delete state.workshop.songSpace.objects[chordID];
    }

    // Clear selection
    state.workshop.selectedChordIDs = [];
    state.workshop.selectedChordID = null;

    // Rebuild workshop space
    actions.updateWorkshopFromSongSpace();

    // Version bump
    state.project.songVersion++;
};

export const copySelectedChords = () => (state, domain, actions) => {
    const seqID = state.editor.selectedSequenceID;
    if (!seqID) return;

    const sequence = state.sequences.byID[seqID];
    if (!sequence) return;

    const selected = state.workshop.selectedChordIDs;
    if (!selected || selected.length === 0) return;

    const songSpace = state.workshop.songSpace;
    if (!songSpace) return;

    const newIDs = [];

    for (const chordID of selected) {
        const original = songSpace.objects[chordID];
        if (!original) continue;

        // Duplicate chord object
        const newChord = domain.chords.duplicateChord(chordID, state)

        // Add to songSpace
        songSpace.objects[newChord.id] = newChord;
        state.chords.byID[newChord.id] = newChord;
        // Queue for insertion
        newIDs.push(newChord.id);
    }

    // Append to end of sequence
    sequence.chordIDs = [...sequence.chordIDs, ...newIDs];

    // Rebuild workshop space
    actions.updateWorkshopFromSongSpace();

    // Version bump
    state.project.songVersion++;
};

export const initiateChordSelection = (pos) => (state) => {
    state.workshop.newChordPos = pos;
    state.project.songVersion++;
   
}

export const cancelNewChord = () => (state) => {
    state.workshop.newChordPos = null;
    state.workshop.newChordSelected = {
        startBeat: null,
        durationBeats: null,
        bass: null,
        chordName: null,
        quality: null,
        root: null,
        chordName: null,
    },
    state.workshop.newChordLength = null;
    state.project.songVersion++;
}

export const getRecommendedChordData = () => async (state, domain) => {
    state.workshop.recommendedChordData = null;
    const parentSequence = state.sequences.byID[state.editor.selectedSequenceID]
    let data = null;
    if(parentSequence.chordIDs.length === 0){
        data = await domain.primary.getEmptySequenceSuggestions(state);
    }else{
        const songSpace = state.workshop.songSpace;
        if(!parentSequence) return;
        if(!songSpace) return;
        const newChordPrev = Object.values(songSpace.objects).find((s)=> (s.startBeat + s.durationBeats) === state.workshop.newChordPos)
        const newChordPos = parentSequence.chordIDs.indexOf(newChordPrev.id)
        const prevChords = parentSequence.chordIDs.slice(0, newChordPos+1);
        data = await domain.primary.getSequenceSuggestions(state, prevChords);
    }
    const entries = Object.entries(data.result);

    // Sort by likelihood DESC (higher = more likely)
    entries.sort((a, b) => b[1] - a[1]);

    const total = entries.length;

    const q1 = Math.floor(total * 0.25);
    const q2 = Math.floor(total * 0.50);
    const q3 = Math.floor(total * 0.75);

    state.workshop.recommendedChordData = {
        Normal: entries.slice(0, q1).map(([chord]) => chord),
        Uncommon: entries.slice(q1, q2).map(([chord]) => chord),
        Strange: entries.slice(q2, q3).map(([chord]) => chord),
        Unadvisable: entries.slice(q3).map(([chord]) => chord),
    };


}

export const setNewChord = (chord) => (state) => {
    state.workshop.newChordSelected = {...state.workshop.newChordSelected, ...chord};

}

export const commitNewChord = () => (state, domain,actions) => {
    const parentSequence = state.sequences.byID[state.editor.selectedSequenceID]
    const songSpace = state.workshop.songSpace;
    const chord = state.workshop.newChordSelected;
    if(!parentSequence) return;
    if(!songSpace) return;
    const newChordPrev = Object.values(songSpace.objects).find((s)=> (s.startBeat + s.durationBeats) === state.workshop.newChordPos)
    let newChordPos
    if(parentSequence.chordIDs.length === 0){
        newChordPos = 0;
    }else{
        newChordPos = parentSequence.chordIDs.indexOf(newChordPrev.id);
    }
    const newChord = domain.chords.createChord({root: chord.root, quality: chord.quality, bass: chord.bass, duration: (state.workshop.newChordLength/parentSequence.timeSignature.numerator)})
    state.chords.byID[newChord.id] = newChord.chord;
    state.chords.allIDs.push(newChord.id);
    const newSequence = domain.sequences.addChordAtPos(parentSequence.id, newChord.id, newChordPos+1, state)
    state.sequences.byID[parentSequence.id] = newSequence;
    state.project.songVersion++;
    actions.cancelNewChord();
}

export const startChordResize = (mouseX, chordID) => (state) => {
    const chord = state.workshop.songSpace.objects[chordID];
    if (!chord) return;

    state.workshop.chordResize = {
        active: true,
        started: false,
        chordID,
        startX: mouseX,
        originalDuration: chord.durationBeats
    };
};

export const updateChordResize = (mouseX) => (state, domain, actions) => {
    const resize = state.workshop.chordResize;
    if (!resize.active) return;

    const chord = state.workshop.songSpace.objects[resize.chordID];
    if (!chord) return;

    const beatWidth = 40 * state.workshop.zoomLevel;
    const dx = mouseX - resize.startX;

    // 3px threshold
    if (!resize.started) {
        if (Math.abs(dx) < 3) return;
        resize.started = true;
    }

    // Convert px → beats
    const deltaBeats = Math.floor(dx / beatWidth);
    const newDuration = Math.max(1, resize.originalDuration + deltaBeats);

    // Prevent overlap with next chord
    const sequence = state.sequences.byID[state.editor.selectedSequenceID];
    const chordObj = state.chords.byID[resize.chordID]
    
    if(newDuration !== (chordObj.duration * sequence.timeSignature.numerator)){
        chordObj.duration = newDuration / sequence.timeSignature.numerator
    }

    // Live update
    actions.updateWorkshopFromSongSpace();
    state.project.songVersion++;
};


export const commitChordResize = () => (state) => {
    state.workshop.chordResize = {
        active: false,
        started: false,
        chordID: null,
        startX: 0,
        originalDuration: 0
    };
};

export const setChordHoveredResize = (id) => (state) => {
    state.workshop.hoveredChordResizeID = id;
};


//Workshop Player
import { getAudioContext } from "../../audio/audioContext.js";
import { startScheduler, resetSchedulerState, stopAllNotes } from "../../audio/scheduler.js";
import { midiOutput } from "../../audio/midiWrapper.js";
import { buildGlobalMidiEventList, getChordEventsFromWorkshop } from "../../data/music/chordExtraction.js"; // where your buildGlobalMidiEventList lives

export const wsSetPlaying = (isPlaying) => (state) => {
  state.player.workshopPlayer.isPlaying = isPlaying;
};

export const wsSetCurrentBeat = (beat) => (state) => {
  state.player.workshopPlayer.currentBeat = beat;
};

export const wsSetPlaybackStart = ({ audioStartTime, beatAtStart }) => (state) => {
  state.player.workshopPlayer.audioStartTime = audioStartTime;
  state.player.workshopPlayer.beatAtStart = beatAtStart;

  stopAllNotes(midiOutput);
  resetSchedulerState();
};

export const wsRewind = () => (state, domain, actions) => {
  actions.wsSetCurrentBeat(0);
  const audioCtx = getAudioContext();
  actions.wsSetPlaybackStart({
    audioStartTime: audioCtx.currentTime,
    beatAtStart: 0,
  });
};

export const wsSetPlayerPosition = (beat) => (state, domain, actions) => {
  const audioCtx = getAudioContext();
  actions.wsSetCurrentBeat(beat);

  if (!state.player.workshopPlayer.isPlaying) {
    actions.wsSetPlaybackStart({
      audioStartTime: audioCtx.currentTime,
      beatAtStart: beat,
    });
  } else {
    actions.wsSetPlaying(false);
  }
};

export const wsPlay = (store) => (state, domain, actions) => {
    // Stop main editor if playing
    if (state.player.isPlaying) {
        actions.pause();
    }

    const audioCtx = getAudioContext();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const currentBeat = state.player.workshopPlayer.currentBeat;

    actions.wsSetPlaybackStart({
        audioStartTime: audioCtx.currentTime,
        beatAtStart: currentBeat,
    });

    actions.wsSetPlaying(true);

    // Build workshop MIDI events
    const ws = state.workshop;
    const secondsAtBeat = ws.songSpace.secondsAtBeat;

    const chordEvents = getChordEventsFromWorkshop(state);
    const globalEvents = buildGlobalMidiEventList(
        chordEvents,
        secondsAtBeat,
        state.player.currentRhythm
    );

    startScheduler(
        state,
        {
            setCurrentBeat: (beat) => actions.wsSetCurrentBeat(beat),
            setPlayheadPosition: (beat) => actions.wsSetCurrentBeat(beat),
            setPlaying: (isPlaying) => actions.wsSetPlaying(isPlaying),
        },
        globalEvents,
        secondsAtBeat,
        midiOutput,
        "Workshop"   // ⭐ THIS IS THE KEY
    );
};


export const wsPause = () => (state, domain, actions) => {
  actions.wsSetPlaying(false);
  midiOutput.stopAll();
  stopAllNotes(midiOutput);
  resetSchedulerState();
};

export const wsFlipPlay = (store) => (state, domain, actions) => {
  if (state.player.workshopPlayer.isPlaying) {
    actions.wsPause();
  } else {
    actions.wsPlay(store);
  }
};

