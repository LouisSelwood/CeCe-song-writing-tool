import * as harmony from "./harmony";
import * as timing from "../../audio/timing.js"

//Creates a series of chord events from the song space
export function extractChordEventsFromSongSpace(state) {
  const events = [];
  const beats = state.editor.songSpace.beats;
  const objects = state.editor.songSpace.objects;
  let currentChordId = null;
  let currentStart = 0;

  //cycles through each beat to detect chord changes
  for (let i = 0; i <= Object.keys(beats).length; i++) {
    const beat = beats[i];
    const chordId = beat?.objects.chord ?? null;

    //checks if the chord is different from the last beat, if so, creates a new chord event
    const changed = chordId !== currentChordId;
    if (changed) {
      if (currentChordId !== null) {
        const chordObj = objects[currentChordId];
        const chordState = state.chords.byID[currentChordId];
        const startBeat = currentStart;
        const endBeat = i;
        const durationBeats = endBeat - startBeat;

        //pushes the event to list of events
        events.push({
          chordId: currentChordId,
          root: chordState.root,
          quality: chordState.quality,
          bass: chordState.bass ?? null,
          startBeat,
          durationBeats,
        });
      }
      currentChordId = chordId;
      currentStart = i;
    }
  }

  return events;
}

//converts chord events to midi numeral format and adds it to the chord event
export function chordEventsToMidiChords(chordEvents) {
  return chordEvents.map(event => ({
    ...event,
    notes: harmony.chordEventToMidiNotes(event),
  }));
}

//converts midi numeral to midi note on/off event
export function chordEventToTimedMidiEvents(chordEvent, startBeat, durationBeats, secondsAtBeat) {
  const notes = harmony.chordEventToMidiNotes(chordEvent);

  //calculates the start and end time in ms
  const startTime = timing.timeAtBeat(startBeat, secondsAtBeat) * 1000;
  const endTime   = timing.timeAtBeat(startBeat + durationBeats, secondsAtBeat) * 1000;

  //generates an array of on/off events
  const events = [];

  for (const note of notes) {
    events.push({ type: "noteOn",  note, time: startTime });
    events.push({ type: "noteOff", note, time: endTime });
  }

  //sorts the event list by time
  events.sort((a, b) => a.time - b.time);

  return events;
}

//converts all chord events into midi on/off events
export function buildGlobalMidiEventList(chordEvents, secondsAtBeat) {
  let globalEvents = [];
  
  //converts midi numerals to on/off events for each chord
  for (const chordEvent of chordEvents) {
    const { startBeat, durationBeats } = chordEvent;

    const events = chordEventToTimedMidiEvents(
      chordEvent,
      startBeat,
      durationBeats,
      secondsAtBeat
    );

    globalEvents.push(...events);
  }

  //sorts the events by time
  globalEvents.sort((a, b) => a.time - b.time);

  return globalEvents;
}