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
}

export const getChordsAsString = (state, sequenceID) => {
    const sequence = state.sequences.byID[sequenceID]
    const chords = sequence.chordIDs.map(id => {
        return state.chords.byID[id];
    })
    const chordStrs = tonal.chordsToString(chords);
    return chordStrs.join(" ")
}

export const getSequenceParent = (state, sequenceID) => {
    const sections = state.project.currentProject.songContents;
    for(const sectionID of sections) {
        const section = state.sections.byID[sectionID]
        if(section.sequenceIDs.includes(sequenceID)){
            return sectionID;
        }
    }

}

export const getSequencePosition = (beatPosition, state) => {
    const songSpace = state.editor.songSpace;
    const sections = state.project.currentProject.songContents;
    if (!songSpace || !songSpace.objects) return null;

    // Find the object whose startBeat matches the requested beat
     const entry = Object.entries(songSpace.objects)
        .find(([id, obj]) =>
            obj.type === "sequence" &&
            obj.startBeat + obj.length === beatPosition
        );
    const sectionID = getSequenceParent(state, entry[0]);
    const pos = state.sections.byID[sectionID].sequenceIDs.indexOf(entry[0]);
    return pos;
}

export const getSequenceAtPosition = (beatPosition, state) => {
    const songSpace = state.editor.songSpace;
    if (!songSpace || !songSpace.objects) return null;

    const entry = Object.entries(songSpace.objects)
        .find(([id, obj]) =>
            obj.type === "sequence" &&
            obj.startBeat + obj.length === beatPosition
        );

    return entry ? entry[0] : null;
};

export const getUniqueSequences = (sectionID, state) => {
    const uniqueSequences = {}
    const section = state.sections.byID[sectionID];
    for(const sequenceID of section.sequenceIDs){
        const contents = getChordsAsString(state, sequenceID);
        if(!Object.keys(uniqueSequences).includes(contents)){
            uniqueSequences[contents] = sequenceID;
        }
    }
    return uniqueSequences;
    
}

export const getSelectedSequencesBounds = (state) => {
    const songSpace = state.editor.songSpace;
    if(state.editor.selectedSequenceIDs.length > 0){
        const leftObject = songSpace.objects[state.editor.selectedSequenceIDs.at(0)]
        const rightObject = songSpace.objects[state.editor.selectedSequenceIDs.at(-1)]
        return {minLeft: leftObject.startBeat, maxRight: rightObject.startBeat + rightObject.length} 
    }
    return {minLeft: null, maxRight: null}
};