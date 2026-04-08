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

export const getUniqueSections = (state) => {
    let uniqueSections = {}
    Object.values(state.sections.byID).forEach((section) => {
        if(!Object.keys(uniqueSections).includes(section.name)){
            uniqueSections[section.name] = section.id;
        }
    })
    return uniqueSections;
}

export const getSectionsAsString = (state) => {
    const songContents = state.project.currentProject.songContents;


    let sections = songContents.map(sectionId => {
        const section = state.sections.byID[sectionId];
        return section ? section.name : null;
    });

    return sections.filter(Boolean); // remove nulls if any IDs are missing
};

export const getSectionPosition = (beatPosition, state) => {
    const songSpace = state.editor.songSpace;
    console.log(songSpace)
    if (!songSpace || !songSpace.objects) return null;

    // Find the object whose startBeat matches the requested beat
     const entry = Object.entries(songSpace.objects)
        .find(([id, obj]) => obj.startBeat === beatPosition);
    
    const pos = state.project.currentProject.songContents.indexOf(entry[0]);
    return pos;
}
