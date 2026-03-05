export const selectSequenceByID = (state, id) => state.sequences.byID[id];
export const selectAllSequences = (state) => state.sequences.allIDs.map(id => state.sequences.byID[i]);

export const getSequenceWidth = (state, sequenceID) => {
    const sequence = state.sequences.byID[sequenceID];
    let widthInBeats = 0;
    sequence.chordIDs.forEach((chordID) => {
        const chord = state.chords.byID[chordID];
        widthInBeats += (chord.duration * sequence.timeSignature.numerator);
    })
    return widthInBeats;
}

export const getContentsAsString = (state, sequenceID) => {
    const sequence = state.sequences.byID[sequenceID]
    let chordStrings = []
    sequence.chordIDs.forEach((chordID) => {
        const chord = state.chords.byID[chordID];
        const qualityAbrev = chord.quality === "Minor" ? "m" : ""
        chordStrings.push(`${chord.root}${qualityAbrev}${chord.extensions.join("")}`);
    })
    return chordStrings;
}