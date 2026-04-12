import { getAudioContext } from "../../audio/audioContext.js";
import { startScheduler } from "../../audio/scheduler.js";
import { midiOutput } from "../../audio/midiWrapper.js"; // MIDI Controller Wrapper
import { resetSchedulerState, stopAllNotes } from "../../audio/scheduler.js";

export const setPlaying = (isPlaying) => (state) => {
    state.player.isPlaying = isPlaying;
}

export const setCurrentBeat = (beat) => (state) => {
    state.player.currentBeat = beat;
};

// Sets the playing position
export const setPlaybackStart = ({audioStartTime, beatAtStart}) => (state, domain, actions) => {
    state.player.audioStartTime = audioStartTime;
    state.player.beatAtStart = beatAtStart;

    // Stop any ringing notes
    stopAllNotes(midiOutput);

    // Reset scheduler event index
    resetSchedulerState();
};


export const play = (store) => (state, domain, actions) => {
    //gets the audio context (this ensures timing is synced across the app
    const audioCtx = getAudioContext();

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }

    const currentBeat = state.player.currentBeat;

    actions.setPlaybackStart({
        audioStartTime: audioCtx.currentTime,
        beatAtStart: currentBeat,
    });

    actions.setPlaying(true);

    const globalEvents = domain.project.getGlobalMidiEventlist(state);
    const secondsAtBeat = state.editor.songSpace.secondsAtBeat;

    startScheduler(
        state,
        actions,
        globalEvents,
        secondsAtBeat,
        midiOutput,  // MIDI controller wrapper
    );
};



//pauses playing
export const pause = () => (state, domain, actions) => {
    actions.setPlaying(false);
};

//initiates rewind
export const rewind = () => (state, domain, actions) => {
    actions.setCurrentBeat(0);
};

export const setPlayerPosition = (beat) => (state, domain, actions) => {
    const audioCtx = getAudioContext();

    actions.setPlayheadPosition(beat);
    actions.setCurrentBeat(beat);

    // IMPORTANT: update beatAtStart when paused
    if (!state.player.isPlaying) {
        actions.setPlaybackStart({
            audioStartTime: audioCtx.currentTime,
            beatAtStart: beat
        });
    }else{
        actions.setPlaying(false);
    }
};
export const extractChordEvents = () => (state, domain) => {
    const chordEvents = domain.project.extractChordEvents(state)
    console.log(chordEvents)
}

export const extractGlobalEvents = () => (state, domain) => {
    const globalEvents = domain.project.getGlobalMidiEventlist(state);
    console.log(globalEvents)
}

