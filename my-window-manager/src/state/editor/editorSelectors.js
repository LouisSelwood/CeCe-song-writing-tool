export const selectSelectedChordID = (state) => state.editor.chordSelected;


export const selectBaseWidth = (state) => {
  const songSpace = state.editor.songSpace;
  const globalBeatWidth = state.editor.beatWidth; // if beatWidth is global

  return Object.keys(songSpace.beats).length * globalBeatWidth;
};

export const beatToX = (beat, state) => {
  return beat * state.editor.beatWidth * state.editor.zoomLevel;
}

export const xToBeat = (x, state) => {
  const { beatWidth, zoomLevel } = state.editor;
  return (x) / (beatWidth * zoomLevel);
}

export const snapBeatToNearestBar = (beat, state) => {
  const beatInfo = state.editor.songSpace.beats[Math.floor(beat)];
  if (!beatInfo) return Math.round(beat); // fallback

  const numerator = beatInfo.timeSignature?.numerator;   // ✔ correct
  const barLength = numerator;                          // beats per bar

  const barIndex = Math.round(beat / barLength);
  return barIndex * barLength;
}


export const beatToSecondsGlobal = (beat, state) =>{
  const map = state.editor.songSpace.secondsAtBeat;

  const whole = Math.floor(beat);
  const frac = beat - whole;

  const spb = 60 / state.editor.songSpace.beats[whole].tempo;

  return map[whole] + frac * spb;
}


export const timeDeltaToBeats = (deltaSeconds, state, startBeat) => {
  const map = state.editor.songSpace.secondsAtBeat;

  const startSeconds = map[Math.floor(startBeat)];
  const targetSeconds = startSeconds + deltaSeconds;

  // Binary search for the beat whose secondsAtBeat is closest to targetSeconds
  let lo = 0;
  let hi = map.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;

    if (map[mid] < targetSeconds) lo = mid + 1;
    else hi = mid - 1;
  }

  const beat = hi;

  // Fractional part
  const beatInfo = state.editor.songSpace.beats[beat];
  const spb = 60 / beatInfo.tempo;

  const frac = (targetSeconds - map[beat]) / spb;

  return beat + frac;
}

