export const gatherChords = () => (state, domain, actions) => {
    let songChords = []
    state.sections.song.forEach((sectionID) => {
        state.sections.byID[sectionID].sequenceIDs.forEach((sequenceID) =>{
            const chords = actions.getSequenceChords({sequenceID});
            songChords.push(...chords);
        })
    })
    console.log("songChords: ");
    console.log(songChords)
}

export const createEmptySection = ({type}) => (state, domain) => {
    const {id, section} = domain.sections.createEmptySection(type);
    state.sections.byID[id] = section;
    state.sections.allIDs.push(id);
    state.sections.song.push(id);
    
}

export const createFullSection = ({type, sequenceIDs}) => (state, domain) => {
    const {id, section} = domain.sections.createFullSection(type, sequenceIDs)
    state.sections.byID[id] = section;
    state.sections.allIDs.push(id);
    state.sections.song.push(id);
}

export const duplicateSection = ({sectionID}) => (state, domain, actions) => {
    let {id, section, sequenceIDs} = domain.sections.duplicateSection(state,sectionID);
    let newSequenceIDs = []
    state.sections.byID[id] = section;
    state.sections.allIDs.push(id);
    state.sections.song.push(id);
    sequenceIDs.forEach((sequenceID) => {
        const id = actions.duplicateSequence({sequenceID})
        newSequenceIDs.push(id);
    })
    console.log(newSequenceIDs)
    section = domain.sections.initiateSequences(state, id, newSequenceIDs)
    state.sections.byID[id] = section;
}

export const addSequence = ({sectionID, sequenceID}) => (state, domain) => {
    const section = domain.sections.addSequence(state, sectionID, sequenceID);
    state.sections.byID[sectionID] = section;
}
export const editSection = (id, changes) => (state, domain) => {
    //domain logic goes in here
}
export const deleteSection = (id) => (state, domain) => {
    //domain logic goes in here
}
export const moveSection = (id, newPosition) => (state, domain) => {
    //domain logic goes in here
}
export const archiveSection = (id, archivePosition) => (state, domain) => {
    //domain logic goes in here
} 