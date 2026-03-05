export const selectSelectedChordID = (state) => state.editor.chordSelected;


export const selectBaseWidth = (state) => {
  const songSpace = state.editor.songSpace;
  console.log(songSpace.beats)
  const globalBeatWidth = state.editor.beatWidth; // if beatWidth is global

  return Object.keys(songSpace.beats).length * globalBeatWidth;
};




