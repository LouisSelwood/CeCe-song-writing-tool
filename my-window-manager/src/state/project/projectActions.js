import { buildSectionFromDSL, buildSequenceFromDSL, buildChordFromDSL } from "../../builders/songBuilders.js"

export const initiateSong = ({songDSL}) => (state, domain) => {
    let sections = [];
    let sequences = [];
    let chords = [];

    songDSL.sections.forEach((section) => {
        const genSection = buildSectionFromDSL(section, domain);
        sections.push({id: genSection.id, section: genSection.section});
        sequences.push(...genSection.sequences);
        chords.push(...genSection.chords);
    })

    for(const s of sections){
        state.project.currentProject = domain.project.addSectionAtEnd(s.id, state);

        state.sections.byID[s.id] = s.section;
        state.sections.allIDs.push(s.id);
        console.log(s.section)
    }

    for(const s of sequences){
        state.sequences.byID[s.id] = s.sequence;
        state.sequences.allIDs.push(s.id);
    }

    for(const c of chords) {
        state.chords.byID[c.id] = c.chord;
        state.chords.allIDs.push(c.id);
    }
}

export const initiateSection = ({sectionDSL, position}) => (state, domain) => {
    const genSection = buildSectionFromDSL(sectionDSL, domain);
    const sequences = genSection.sequences;
    const chords = genSection.chords;

    state.sections.byID[genSection.id] = genSection.section;
    state.sections.allIDs.push(genSection.id);

    if(position === null) state.project.currentProject = domain.project.addSectionAtEnd(genSection.id, state);
    else state.project.currentProject = domain.project.addSectionAtPos(genSection.id, position, state);

    for(const s of sequences){
        state.sequences.byID[s.id] = s.sequence;
        state.sequences.allIDs.push(s.id);
    }
    for(const c of chords){
        state.chords.byID[c.id] = c.chord;
        state.chords.allIDs.push(c.id);
    }

}

export const initiateSequence = ({sequenceDSL, parentID, position}) => (state, domain) => {
    const genSequence = buildSequenceFromDSL(sequenceDSL, domain)
    const chords = genSequence.chords;
    
    if (position === null) state.sections.byID[parentID] = domain.sections.addSectionAtEnd(parentID, genSequence.id, state);
    else state.sections.byID[parentID] = domain.sections.addSectionAtPos(parentID, genSequence.id, position, state);

    state.sections.byID[parentID].sequenceIDs.push(genSequence.id);
    state.sequences.byID[genSequence.id] = genSequence.sequence;
    state.sequences.allIDs.push(genSequence.id);

    for(const c of chords) {
        state.chords.byID[c.id] = c.chord;
        state.chords.allIDs.push(c.id);
    }
}

export const initiateChord = ({chordDSL, parentID, position}) => (state, domain) => {
    const genChord = buildChordFromDSL(chordDSL, domain);

    if(position === null) state.sequences.byID[parentID] = domain.sequences.addChordAtEnd(parentID, genChord.id, state);
    else state.sequences.byID[parentID] = domain.sequences.addChordAtPos(parentID, genChord.id, position, state);

    state.chords.byID[genChord.id] = genChord.chord;
    state.chords.allIDs.push(genChord.id);
}

