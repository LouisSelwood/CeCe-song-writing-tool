export const selectSelectedChordID = (state) => state.editor.chordSelected;

export const selectSongSpace = (state) => {
    const song = state.sections.song;
    const songSpace = []
    let currentBeat = 0;
    song.forEach((sectionID) => { 
        const sequenceIDs = state.sections.byID[sectionID].sequenceIDs;
        sequenceIDs.forEach((sequenceID) => {
            const sequence = state.sequences.byID[sequenceID];
            let sequenceLength = 0;
            sequence.chordIDs.forEach((chordID) => {
                sequenceLength += state.chords.byID[chordID].duration * sequence.timeSignature.numerator;
            })
            const songSpaceObj = {
                id: sequenceID,
                startBeat: currentBeat, 
                endBeat: currentBeat+sequenceLength, 
                tempo: sequence.tempo, 
                timeSignature: sequence.timeSignature,
                rhythm: sequence.rhythm
            }
            currentBeat = songSpaceObj.endBeat;
            songSpace.push(songSpaceObj);
        })
    })
    return songSpace;
};

export const selectBaseWidth = (state) => {
  const songSpace = selectSongSpace(state);
  const globalBeatWidth = state.editor.beatWidth; // if beatWidth is global

  return songSpace.reduce((acc, seq) => {
    const beats = seq.endBeat - seq.startBeat;
    const beatWidth = seq.rhythm?.beatWidth ?? globalBeatWidth;
    return acc + beats * beatWidth;
  }, 0);
};




