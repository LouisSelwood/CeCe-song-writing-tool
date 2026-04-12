// Imports
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

export function startScheduler(
  state,
  actions,
  globalEvents,
  secondsAtBeat,
  midiOutput
) {
  // If the scheduler is already active, then quit
  if (schedulerRunning) {
    console.log("Scheduler already running");
    return;
  }
  schedulerRunning = true;

  const audioCtx = getAudioContext();
  const player = state.player;

  // Determines the start beat
  const startBeat = player.currentBeat;

  // Convert beats to ms
  const startTimeMs = timeAtBeat(startBeat, secondsAtBeat) * 1000;

  // Find the first event at or after this time
  // (THIS IS THE FIX — ensures playback starts at the correct event index)
  let currentEventIndex = globalEvents.findIndex(evt => evt.time >= startTimeMs);
  if (currentEventIndex < 0) currentEventIndex = globalEvents.length;

  // Scheduling loop
  const loop = () => {
    const player = state.player;

    // Checks if the user has stopped the player and ends the scheduling loop
    if (!player.isPlaying) {
      console.log("Player stopped, shutting down scheduler");

      stopAllNotes(midiOutput);
      schedulerRunning = false;
      return;
    }

    // Calculates the current time in seconds
    const now = audioCtx.currentTime;
    const deltaSeconds = now - player.audioStartTime;

    // Calculates the current beat
    const newBeat = timeDeltaToBeats(deltaSeconds, state, player.beatAtStart);

    // Ends the playback when the player reaches the end of the song
    if (newBeat >= state.editor.endPosition) {
      console.log("End reached, stopping playback");

      actions.setPlaying(false);
      actions.setPlayheadPosition(state.editor.endPosition);

      stopAllNotes(midiOutput);
      schedulerRunning = false;
      return;
    }

    // Updates the state
    actions.setPlayheadPosition(newBeat);
    actions.setCurrentBeat(newBeat);

    // Calculates the players current position
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

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}
