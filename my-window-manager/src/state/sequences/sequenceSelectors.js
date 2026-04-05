import * as tonal from "../../../src/data/utils/tonalWrapper.js";

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

export const getAverageSequenceLength = (state) => {
    let widths = {}
    const song = state.project.currentProject.songContents;
    song.forEach((sectionID) => {
        const section = state.sections.byID[sectionID];
        section.sequenceIDs.forEach((sequenceID) => {
            widths[sequenceID] = 0;
            const sequence = state.sequences.byID[sequenceID];
            sequence.chordIDs.forEach((chordID) => {
                const chord = state.chords.byID[chordID];
                widths[sequenceID] += chord.duration * sequence.timeSignature.numerator;
            })
        })
    })
    const pureWidths = Object.values(widths);
    if (!Array.isArray(pureWidths) || pureWidths.length === 0) return NaN;
    const sum = pureWidths.reduce((s, v) => s + v, 0);
    return sum / pureWidths.length;
}

export const getChordsAsNotation = (state, sequenceID) => {
    const sequence = state.sequences.byID[sequenceID];
    if (!sequence) return [];
    const chords = sequence.chordIDs.map(id => {
        return state.chords.byID[id];
    })
    const chordStrs = tonal.chordsToString(chords);
    return chords.map((chord, index) => ({
        name: chordStrs[index],
        length: (chord.duration * sequence.timeSignature.numerator)
    }))
    // const key = sequence.keySignature;
    // const romanProgression = tonal.chordsToRoman(chordStrs, key)

    // return romanProgression.map((notation, index) => ({
    //     notation,
    //     length: (chords[index].duration * sequence.timeSignature.numerator)
    // }));
}