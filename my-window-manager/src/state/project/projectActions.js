import { buildSectionFromDSL, buildSequenceFromDSL, buildChordFromDSL } from "../../builders/songBuilders"

export const initiateSong = ({songDSL}) => (state, domain) => {
    //initiates object holders
    let sections = [];
    let sequences = [];
    let chords = [];

    //recieves song objects from builders
    songDSL.sections.forEach((section) => {
        const genSection = buildSectionFromDSL(section, domain);
        genSection.section.name = genSection.section.name.toLowerCase();
        sections.push({id: genSection.id, section: genSection.section});
        sequences.push(...genSection.sequences);
        chords.push(...genSection.chords);
    })

    //commits newly built song objects to state
    for(const s of sections){
        state.project.currentProject = domain.project.addSectionAtEnd(s.id, state);

        state.sections.byID[s.id] = s.section;
        state.sections.allIDs.push(s.id);
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
    //gets generated section, sequence, and chord objects from builders
    const genSection = buildSectionFromDSL(sectionDSL, domain);
    const sequences = genSection.sequences;
    const chords = genSection.chords;

    //commits section to state
    state.sections.byID[genSection.id] = genSection.section;
    state.sections.allIDs.push(genSection.id);

    //checks if new position is given, if not then add object at the end of parent
    if(!Number.isInteger(position)) state.project.currentProject = domain.project.addSectionAtEnd(genSection.id, state);
    else state.project.currentProject = domain.project.addSectionAtPos(genSection.id, position, state);

    //commits the rest of song objects
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
    //gets generated sequence and chords from builders
    const genSequence = buildSequenceFromDSL(sequenceDSL, domain)
    const chords = genSequence.chords;
    
    //commits new sequence to state
    state.sequences.byID[genSequence.id] =  genSequence.sequence;

    state.sequences.allIDs.push(genSequence.id);
    //checks if new position is given, if not then add object at the end of parent
    if (!Number.isInteger(position)) state.sections.byID[parentID] = domain.sections.addSequenceAtEnd(parentID, genSequence.id, state); 
    else state.sections.byID[parentID] = domain.sections.addSequenceAtPos(parentID, genSequence.id, position, state); console.log("Position");

    //commits new chords to state
    for(const c of chords) {
        state.chords.byID[c.id] = c.chord;
        state.chords.allIDs.push(c.id);
    }
}

export const initiateChord = ({chordDSL, parentID, position}) => (state, domain) => {
    //gets new chord from builders
    const genChord = buildChordFromDSL(chordDSL, domain);

    //commits chord to state
    state.chords.byID[genChord.id] = genChord.chord;
    state.chords.allIDs.push(genChord.id);

    //checks if new position is given, if not then add object at the end of parent
    if(!Number.isInteger(position)) state.sequences.byID[parentID] = domain.sequences.addChordAtEnd(parentID, genChord.id, state);
    else state.sequences.byID[parentID] = domain.sequences.addChordAtPos(parentID, genChord.id, position, state);

}

//generates a readable string which shows the songs current contents, useful for testing
export const getSongDescription = () => (state, domain) => {
    const sections = domain.project.getSections(state);
    let description = "";
    sections.forEach((section) => {
        description += `${section.name} \n`;
        const sequences = domain.sections.getSequences(section.id, state);
        sequences.forEach((sequence) => {
            const chords = domain.sequences.getChords(sequence.id, state);
            chords.forEach((chord) => {
                const chordString = domain.chords.getChordAsString(chord.id, state);
                description +=  `${chordString},  `
            })
            description += `\n`
        })
    })
    console.log(description)
    return description;
}

export const setProjectName = (name) => (state, domain) => {
    if(domain.project.validateProjectName(name)){
        state.project.currentProject.name = name;
    }else{
        window.electronAPI.showError("Invalid Name", "project name must be parsable as a file name")
    }
}
