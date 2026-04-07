export const copySectionAtEnd = (sectionID) => (state, domain) => {
    let newSequences = [];
    let newChords = [];
    //creates new section and adds to project
    const section = state.sections.byID[sectionID];
    console.log(section)
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
    console.log(newSection);
    console.log(newSequences);
    console.log(newChords)
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