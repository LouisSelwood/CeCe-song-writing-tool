export const addEmptySectionAtEnd = () => (state, domain) => {
    const newSection = domain.sections.createEmptySection("Section");
    state.project.currentProject = domain.project.addSectionAtEnd(newSection.id, state)
    state.sections.byID[newSection.id] = newSection;
    state.sections.allIDs.push(newSection.id)
    state.project.songVersion++;
}

export const addEmptySectionAtPos = (pos) => (state, domain) => {
    const newSection = domain.sections.createEmptySection("Section");
    state.project.currentProject = domain.project.addSectionAtPos(newSection.id, pos, state)
    state.sections.byID[newSection.id] = newSection;
    state.sections.allIDs.push(newSection.id)
    state.project.songVersion++;
}

export const copySectionAtEnd = (sectionID) => (state, domain) => {
    let newSequences = [];
    let newChords = [];
    //creates new section and adds to project
    const section = state.sections.byID[sectionID];

    let newSection = domain.sections.duplicateSection(section)
    state.project.currentProject = domain.project.addSectionAtEnd(newSection.id, state)

    //cycles through sequences
    section.sequenceIDs.forEach((sequenceID) => {
        //creates new sequences and adds to section
        const sequence = state.sequences.byID[sequenceID];
        let newSequence = domain.sequences.duplicateSequence(sequence);
        newSection = domain.sections.addSequenceAtEnd(newSection, newSequence.id);

        //cycles through chords
        sequence.chordIDs.forEach((chordID) => {
            //creates new chords and adds to sequence
            const newChord = domain.chords.duplicateChord(chordID, state);
            newSequence = domain.sequences.addChordAtEnd(newSequence, newChord.id);

            //adds chord to state
            newChords.push(newChord);
        })

        //adds sequence to state
        newSequences.push(newSequence);
    })

    //adds section to state
    state.sections.byID[newSection.id] = newSection;
    state.sections.allIDs.push(newSection.id)
    for(const s of newSequences){
        state.sequences.byID[s.id] = s;
        state.sequences.allIDs.push(s.id);
    }

    for(const c of newChords){
        state.chords.byID[c.id] = c;
        state.chords.allIDs.push(c.id);
    }

    state.project.songVersion++;
}

export const copySectionAtPos = (sectionID, pos) => (state, domain) => {
    let newSequences = [];
    let newChords = [];
    //creates new section and adds to project
    const section = state.sections.byID[sectionID];
    let newSection = domain.sections.duplicateSection(section)
    state.project.currentProject = domain.project.addSectionAtPos(newSection.id, pos, state)

    //cycles through sequences
    section.sequenceIDs.forEach((sequenceID) => {
        //creates new sequences and adds to section
        const sequence = state.sequences.byID[sequenceID];
        let newSequence = domain.sequences.duplicateSequence(sequence);
        newSection = domain.sections.addSequenceAtEnd(newSection, newSequence.id);

        //cycles through chords
        sequence.chordIDs.forEach((chordID) => {
            //creates new chords and adds to sequence
            const newChord = domain.chords.duplicateChord(chordID, state);
            newSequence = domain.sequences.addChordAtEnd(newSequence, newChord.id);

            //adds chord to state
            newChords.push(newChord);
        })

        //adds sequence to state
        newSequences.push(newSequence);
    })

    //adds section to state
    state.sections.byID[newSection.id] = newSection;
    state.sections.allIDs.push(newSection.id)
    for(const s of newSequences){
        state.sequences.byID[s.id] = s;
        state.sequences.allIDs.push(s.id);
    }

    for(const c of newChords){
        state.chords.byID[c.id] = c;
        state.chords.allIDs.push(c.id);
    }

    state.project.songVersion++;
}

export const deleteSelectedSections = () => (state) => {
    const sections = state.editor.selectedSectionIDs;
    const sequences = []
    for(const sectionID of sections){
        const section = state.sections.byID[sectionID]
        for(const sequenceID of section.sequenceIDs){
            sequences.push(sequenceID)
        }
    }


    //Delete song objects
    for(const s of sections){
        state.sections.allIDs = state.sections.allIDs.filter(x => x !== s);
        delete state.sections.byID[s];
        state.project.currentProject.songContents = state.project.currentProject.songContents.filter(x => x !== s);
    }

    for(const s of sequences){
        delete state.sequences.byID[s];
        state.sequences.allIDs = state.sequences.allIDs.filter(x => x !== s);
    }
    
    state.project.songVersion++;
}

export const duplicateSelectedSections = () => (state, domain, actions) => {
    const sections = state.editor.selectedSectionIDs;
    const endSection = state.editor.selectedSectionIDs.at(-1)
    let endPos = state.project.currentProject.songContents.indexOf(endSection) + 1;
    for(const sectionID of sections){
        actions.copySectionAtPos(sectionID, endPos);
        endPos++;
    }
}

export const changeSectionName = (sectionID, name) => (state) => {
    state.sections.byID[sectionID].name = name;
}