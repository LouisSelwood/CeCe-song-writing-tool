export const selectSectionsByID = (state, id) => state.sections.byID[id];
export const selectAllSections = (state) => state.sections.allIDs.map(id => state.sections.byID[id]);