export const playerInitialState={
    isPlaying: false,
    currentBeat: 0,        // where the playhead is, in beats
    audioStartTime: null,  // audioCtx.currentTime when playback started
    beatAtStart: 0,        // beat position at the moment we hit play

}