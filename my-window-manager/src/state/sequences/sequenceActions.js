export const copySequenceAtPos = (sectionID, sequenceID, pos) => (state, domain) => {
    const section = state.sections.byID[sectionID];
    const originalSequence = state.sequences.byID[sequenceID];

    if (!section || !originalSequence) {
        console.warn("Invalid section or sequence ID");
        return;
    }

    // --- Duplicate the sequence ---
    const newSequence = domain.sequences.duplicateSequence(originalSequence);

    // Track duplicated chords so we can add them to state later
    const newChords = [];

    // --- Duplicate chords and attach them to the new sequence ---
    originalSequence.chordIDs.forEach((chordID) => {
        const newChord = domain.chords.duplicateChord(chordID, state);
        newChords.push(newChord);

        // Add chord to the new sequence
        newSequence.chordIDs = [...newSequence.chordIDs, newChord.id];
    });

    // --- Insert the new sequence ID at the specified position ---
    const updatedSequenceIDs = [...section.sequenceIDs];
    updatedSequenceIDs.splice(pos, 0, newSequence.id); // OPTION A behaviour

    // --- Create updated section object ---
    const updatedSection = {
        ...section,
        sequenceIDs: updatedSequenceIDs
    };

    // --- Update state: section ---
    state.sections.byID[sectionID] = updatedSection;

    // --- Update state: new sequence ---
    state.sequences.byID[newSequence.id] = newSequence;
    state.sequences.allIDs.push(newSequence.id);

    // --- Update state: new chords ---
    for (const chord of newChords) {
        state.chords.byID[chord.id] = chord;
        state.chords.allIDs.push(chord.id);
    }

    // Increment version
    state.project.songVersion++;
};

export const deleteSelectedSequences = () => (state) => {
  const selected = state.editor.selectedSequenceIDs;
  if (!selected || selected.length === 0) return;

  // Remove each sequence from its parent section
  for (const seqID of selected) {
    const parentSectionID = state.project.currentProject.songContents
      .find(sectionID => state.sections.byID[sectionID].sequenceIDs.includes(seqID));

    if (parentSectionID) {
      const arr = state.sections.byID[parentSectionID].sequenceIDs;
      state.sections.byID[parentSectionID].sequenceIDs = arr.filter(id => id !== seqID);
    }

    // Remove from sequences store
    delete state.sequences.byID[seqID];
    state.sequences.allIDs = state.sequences.allIDs.filter(x => x !== seqID);
  }

  state.project.songVersion++;
};

export const duplicateSelectedSequences = () => (state, domain, actions) => {
    const sequences = state.editor.selectedSequenceIDs;
    const endSequence = sequences.at(-1)
    const sections = state.project.currentProject.songContents;
    const getSequenceParent = (sequenceID) => {
        const sections = state.project.currentProject.songContents;
        for(const sectionID of sections) {
            const section = state.sections.byID[sectionID]
            if(section.sequenceIDs.includes(sequenceID)){
                return sectionID;
            }
        }
    }
    const firstParent = getSequenceParent(sequences[0]);
    for(const sequenceID of sequences) {
        const sequenceParent = getSequenceParent(sequenceID);
        if(sequenceParent !== firstParent){
            window.electronAPI.showError("Invalid Action", "cannot duplicate sequences from different sections")
            return;
        } 
    }

    let endPos = state.sections.byID[firstParent].sequenceIDs.indexOf(endSequence) + 1;
    for(const sequenceID of sequences){
        actions.copySequenceAtPos(firstParent, sequenceID, endPos);
        endPos++;
    }
}

