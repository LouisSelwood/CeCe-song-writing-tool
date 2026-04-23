import { getAudioContext } from "../../data/audio/audioContext.js";
import { startScheduler } from "../../data/audio/scheduler.js";
import { midiOutput } from "../../data/audio/midiWrapper.js"; // MIDI Controller Wrapper
import { resetSchedulerState, stopAllNotes } from "../../data/audio/scheduler.js";
import { loadInstrument } from "../../data/audio/midiWrapper.js";
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
    state.editor.scrollPosition = (currentBeat * state.editor.beatWidth * state.editor.zoomLevel) - 200;

    actions.setPlaybackStart({
        audioStartTime: audioCtx.currentTime,
        beatAtStart: currentBeat,
    });

    actions.setPlaying(true);

    const globalEvents = domain.app.getGlobalMidiEventlist(state);
    const secondsAtBeat = state.editor.songSpace.secondsAtBeat;

    startScheduler(
        state,
        actions,
        globalEvents,
        secondsAtBeat,
        midiOutput,  // MIDI controller wrapper
        "Global"
    );
};



//pauses playing
export const pause = () => (state, domain, actions) => {
    actions.setPlaying(false);
    midiOutput.stopAll(); 
    stopAllNotes(midiOutput);
    resetSchedulerState();
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

export const flipPlay = () => (state, domain, actions) => {
    if(state.player.isPlaying){
        actions.pause();
    }else{
        actions.play();
    }
}

export const setActiveInstrument = ({ref, name}) => (state) => {
    loadInstrument(ref);
    state.player.currentInstrument = name;

}

export const setRhythm = (pattern) => (state) => {
    state.player.currentRhythm = pattern;
}


// Rewind/Fast Forward Impementation

export const rewind = () => (state, domain, actions) => {
    let targetBeat;

    if (state.editor.activeEditor === "song") {
        targetBeat = domain.sections.getPreviousSectionBeat(state);
    } else {
        targetBeat = domain.sequences.getPreviousSequenceBeat(state);
    }

    actions.setPlayerPosition(targetBeat);

}

export const fastForward = () => (state, domain, actions) => {
    let targetBeat;

    if (state.editor.activeEditor === "song") {
        targetBeat = domain.sections.getNextSectionBeat(state);
    } else {
        targetBeat = domain.sequences.getNextSequenceBeat(state);
    }

    actions.setPlayerPosition(targetBeat);
}

