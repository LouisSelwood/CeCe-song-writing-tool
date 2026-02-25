export const createChord = ({parentID, params}) => (state, domain) => {
    const {id, chord} = domain.chords.createChord(state, params);
    state.chords.byID[id] = chord;
    state.chords.allIDs.push(id);
    state.sequences.byID[parentID] = domain.sequences.addChord(state, parentID, id);
}

export const createLooseChord = ({params}) => (state, domain) =>{
    const {id, chord} = domain.chords.createChord(params);
    state.chords.byID[id] = chord;
    state.chords.allIDs.push(id);
}

export const duplicateChord = ({chordID}) => (state, domain) => {
    const {id, chord} = domain.chords.duplicateChord(state, chordID);
    state.chords.byID[id] = chord;
    state.chords.allIDs.push(id);
    return id;
}

export const getChord = ({chordID}) => (state) => {
    return state.chords.byID[chordID];
}
export const editChord = (id, changes) => (state, domain) => {
    //domain logic goes in here
}
export const deleteChord = (id) => (state, domain) => {
    //domain logic goes in here
} 
export const moveChord = (id, delta) => (state, domain) => {
    //domain logic goes in here
}
export const replaceChord = (id) => (state, domain) => {
    //domain logic goes in here
}