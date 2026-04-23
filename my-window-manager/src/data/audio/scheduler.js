//Import dependancies
import { getAudioContext } from "./audioContext";
import { timeDeltaToBeats, timeAtBeat } from "./timing";

// Schedule global truths
let schedulerRunning = false;
let activeNotes = new Set();

// Generates random velocity in order to make the midi notes sound more human
function randomVelocity(min = 80, max = 120) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

// Resets the scheduler (called on play)
export function resetSchedulerState() {
    activeNotes.clear();
}

// Turns off all notes that are currently playing
export function stopAllNotes(midiOutput) {
    for (const note of activeNotes) {
        midiOutput.noteOff(note);
    }
    activeNotes.clear();
}

/*
    The schedulers job is to continously read the audio clock when the player is playing, and update the state accordingly.
    Its roles include:
        - Updating the UI playhead
        - Updating MIDI note on/off events
        - Reacting to player pausing and playing

*/
export function startScheduler(
    state,
    actions,
    globalEvents, //MIDI on/off events, built off the songspace
    secondsAtBeat,
    midiOutput,  //Reference to the MIDI wrapper
    playerKey,   /*The key of the player currently playing...
                        "Global": song editor player
                        "Workshop": chord workshop player
    */


    ) {

    // If the scheduler is already active, then quit
    if (schedulerRunning) {
        console.log("Scheduler already running");
        return;
    }
    schedulerRunning = true;

    //Gets the audio context reference from the singleton
    const audioCtx = getAudioContext();

    //Sets the active player, depending on the playerKey
    let player = state.player;
    if(playerKey === "Workshop"){
        player = state.player.workshopPlayer;
    }


    // Sets the beat the scheduler is to start from
    const startBeat = player.currentBeat;

    // Converts the start beat to ms
    const startTimeMs = timeAtBeat(startBeat, secondsAtBeat) * 1000;

    // Finds the index of the event that occurrs at the player start time
    let currentEventIndex = globalEvents.findIndex(evt => evt.time >= startTimeMs);
    if (currentEventIndex < 0) currentEventIndex = globalEvents.length; /*if no events happen after the start beat, 
                                                                            then max out the current event index*/

    // Scheduling loop
    const loop = () => {
        //Finds the currently active player
        let player = state.player;
        if(playerKey === "Workshop"){
            player = state.player.workshopPlayer;
        }

        // Checks whether the player is stopped, if so it ends the loop.
        if (!player.isPlaying) {
            console.log("Player stopped, shutting down scheduler");

            stopAllNotes(midiOutput); //IMPORTANT: this stops the notes from ringing out and stopping
            activeNotes.clear();
            schedulerRunning = false;
            return;
        }

        // Gets the global time from the audio context clock
        const now = audioCtx.currentTime;
        // Gets the current time, relative to the audio start time
        const deltaSeconds = now - player.audioStartTime;

        // Calculates the current beat (fractional)
        const newBeat = timeDeltaToBeats(deltaSeconds, state, player.beatAtStart);

        // Ends the playback when the player reaches the end of the song
        if (newBeat >= (state.editor.endPosition)) {
            console.log("End reached, stopping playback");

            actions.setPlaying(false);
            actions.setPlayheadPosition(state.editor.endPosition);

            stopAllNotes(midiOutput);
            schedulerRunning = false;
            return;
        }

        // Updates the UI and MIDI
        actions.setPlayheadPosition(newBeat);
        actions.setCurrentBeat(newBeat);

        // Calculates the players current position in ms
        const currentTimeMs = timeAtBeat(newBeat, secondsAtBeat) * 1000;

        // Dispatches all MIDI events which occur at the current position
        while (
            currentEventIndex < globalEvents.length &&
            globalEvents[currentEventIndex].time <= currentTimeMs
        ) {
            const evt = globalEvents[currentEventIndex];

            if (evt.type === "noteOn") {
                const velocity = randomVelocity();
                midiOutput.noteOn(evt.note, velocity);
                activeNotes.add(evt.note);
            } else if (evt.type === "noteOff") {
                midiOutput.noteOff(evt.note);
                activeNotes.delete(evt.note);
            }

            currentEventIndex++;
        }
        //Reiterates the scheduler loop on the next view frame
        //This insures the scheduler runs fro each frame
        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}
