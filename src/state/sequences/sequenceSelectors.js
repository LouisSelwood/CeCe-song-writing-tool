export const selectSequenceByID = (state, id) => state.sequences.byID[id];
export const selectAllSequences = (state) => state.sequences.allIDs.map(id => state.sequences.byID[i]);