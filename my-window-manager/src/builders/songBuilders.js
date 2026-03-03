export function buildSectionFromDSL(sectionDSL, domain){
    let {id, section} = domain.sections.createEmptySection(sectionDSL.name);
    let sequences = [];
    let chords = [];
    sectionDSL.sequences.forEach((sequence) => { 
        const genSequence = buildSequenceFromDSL(sequence, domain);
        section.sequenceIDs.push(genSequence.id)
        sequences.push({id: genSequence.id, sequence: genSequence.sequence})
        chords.push(...genSequence.chords);
    })
    return({section, id, sequences, chords});
    
}

export function buildSequenceFromDSL(sequenceDSL, domain){

    let timeSignature = getTimeSig(sequenceDSL.timeSignature)
    let {id, sequence} = domain.sequences.createEmptySequence({
        tempo: sequenceDSL.tempo, 
        timeSignature: timeSignature, 
        rhythm: sequenceDSL.rhythm
    });
    
    let chords = []
    sequenceDSL.chords.forEach((chord) => {
        const genChord = buildChordFromDSL(chord, domain)
        sequence.chordIDs.push(genChord.id)
        chords.push(genChord);
    })
    return({id, sequence, chords})

}

export function buildChordFromDSL(chordDSL, domain){
    let {id, chord} = domain.chords.createChord(chordDSL)
    return {id, chord};
}

function getTimeSig(timeSignature){
    const textTimeSignature = timeSignature.split("/")
    return {numerator: parseInt( textTimeSignature[0], 10), denominator: parseInt( textTimeSignature[1], 10)};
}