export const createEmptySequence = ({parentID}) => (state, domain) => {
    const {id, sequence} = domain.sequences.createEmptySequence();
    state.sequences.byID[id] = sequence;
    state.sequences.allIDs.push(id);
    state.sections.byID[parentID] = domain.sections.addSequence(state, parentID, id)
}

export const createFullSequence = ({parentID, chordIDs}) => (state, domain) => {
    const {id, sequence} = domain.sequences.createFullSequence(chordIDs);
    state.sequences.byID[id] = sequence;
    state.sequences.allIDs.push(id);
    state.sections.byID[parentID] = domain.sections.addSequence(state, parentID, id);
}

export const createEmptyLooseSequence = ({}) => (state, domain) => {
    const {id, sequence} = domain.sequences.createEmptySequence();
    state.sequences.byID[id] = sequence;
    state.sequences.allIDs.push(id);
}

export const createFullLooseSequence = ({chordIDs}) => (state, domain) => {
    const {id, sequence} = domain.sequences.createFullSequence(chordIDs);
    state.sequences.byID[id] = sequence;
    state.sequences.allIDs.push(id);
}

export const duplicateSequence = ({sequenceID}) => (state, domain, actions) => {
    console.log(`duplicated sequence chords: ${state.sequences.byID[sequenceID].chordIDs.length}`)
    let {id, sequence, chordIDs} = domain.sequences.duplicateSequence(state, sequenceID);
    let newChordIDs = []
    state.sequences.byID[id] = sequence;
    state.sequences.allIDs.push(id);
    chordIDs.forEach((chordID) => {
        const id = actions.duplicateChord({chordID})
        newChordIDs.push(id);
    })
    sequence = domain.sequences.initiateChords(state, id, newChordIDs);
    state.sequences.byID[id] = sequence;
    state.sequences = {...state.sequences};
    return id;
}

export const getSequenceChords = ({sequenceID}) => (state, domain, actions) => {
    let chords = []
    state.sequences.byID[sequenceID].chordIDs.forEach((chordID) => {
        const chord = actions.getChord({chordID});
        chords.push(chord)
    })
    return chords;
}

export const editSequence = (id, changes) => (state, domain) => {
    //domain logic goes in here
}
export const deleteSequence = (id) => (state, domain) => {
    //domain logic goes in here
}
export const moveSequence = (id, newPosition) => (state, domain) => {
    //domain logic goes in here
}
export const archiveSequence = (id, archivePosition) => (state, domain) => {
    ///domain logic goes in here
}
