
// Gets the beat position from delta time
export function timeDeltaToBeats(deltaSeconds, state, startBeat){
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
    if (beat < 0) return 0;
    if (beat >= map.length - 1) return map.length - 1;

    // Gets the fraction of throught beat
    const beatInfo = state.editor.songSpace.beats[beat];
    const spb = 60 / beatInfo.tempo;
    const frac = (targetSeconds - map[beat]) / spb;

    return beat + frac;
}

//gets the time in ms from the current beat position
export function timeAtBeat(beat, secondsAtBeat) {
    const i = Math.floor(beat);
    const frac = beat - i;

    if (i >= secondsAtBeat.length - 1) {
        return secondsAtBeat[secondsAtBeat.length - 1];
    }

    const t1 = secondsAtBeat[i];
    const t2 = secondsAtBeat[i + 1];

    return t1 + (t2 - t1) * frac;
}
