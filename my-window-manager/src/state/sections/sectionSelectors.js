export const selectSectionsByID = (state, id) => state.sections.byID[id];
export const selectAllSections = (state) => state.sections.allIDs.map(id => state.sections.byID[id]);

export const getSectionWidth = (state, id) => {
    const section = state.sections.byID[id];
    let widthInBeats = 0;
    section.sequenceIDs.forEach((sequenceID) => {
        const sequence = state.sequences.byID[sequenceID];
        sequence.chordIDs.forEach((chordID) => {
            const chord = state.chords.byID[chordID];
            widthInBeats += (chord.duration * sequence.timeSignature.numerator);
        })
    })
    return widthInBeats;
}