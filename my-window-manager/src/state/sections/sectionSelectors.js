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

export const getAverageSectionLength = (state) => {
    let widths = {}
    const song = state.project.currentProject.songContents;
    song.forEach((sectionID) => {
        widths[sectionID] = 0;
        const section = state.sections.byID[sectionID];
        section.sequenceIDs.forEach((sequenceID) => {
            const sequence = state.sequences.byID[sequenceID];
            sequence.chordIDs.forEach((chordID) => {
                const chord = state.chords.byID[chordID];
                widths[sectionID] += chord.duration * sequence.timeSignature.numerator;
            })
        })
    })
    const pureWidths = Object.values(widths);
    if (!Array.isArray(pureWidths) || pureWidths.length === 0) return NaN;
    const sum = pureWidths.reduce((s, v) => s + v, 0);
    return sum / pureWidths.length;
}

export const getFinalPosition = (state) => {
    const songSpace = state.editor.songSpace;
    
}