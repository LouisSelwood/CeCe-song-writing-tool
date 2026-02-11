export const selectChordByID = (state, id) => state.chords.byID[id];
export const selectAllChords = (state) => state.chords.allIDs.map(id => state.chords.byID[id]);