export const getSequenceID = (state, chordID) => {
    
    const sequences = state.sequences.byID;
    for (const seqID in sequences) {
        const sequence = sequences[seqID];
        if (sequence.chordIDs.includes(chordID)) {
            return seqID;
        }
    }


    return null;
}

export const getChordWidth = (state, sequenceID, chordID) => {
    const chord = state.chords.byID[chordID];
    const sequence = state.sequences.byID[sequenceID]
    const chordWidth = chord.duration * sequence.timeSignature.numerator;
    return chordWidth;
}

export const getChordAsString = (state, chordID) => {
    const chord = state.chords.byID[chordID];
    const qualityAbrev = chord.quality === "Minor" ? "m" : ""
    return `${chord.root}${qualityAbrev}${chord.extensions.join("")}`;
}