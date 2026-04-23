import * as harmony from "./harmony.js";
import * as timing from "../timing.js"
import { RHYTHM_PATTERNS } from "../rhythms.js";

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

export function getChordEventsFromWorkshop(state){
  const events = [];
  const ws = state.workshop;

  for (const beat of Object.values(ws.songSpace.beats)) {
    const chordId = beat.chordID;

    if (!chordId) continue;
    let chordData;

    if (chordId === "newChord") {
      chordData = ws.newChordSelected;
    } else {
      chordData = {...ws.songSpace.objects[chordId], ...state.chords.byID[chordId]};

    }
    if (!chordData) continue;
    events.push({
      startBeat: chordData.startBeat,
      durationBeats: chordData.durationBeats,
      // whatever your harmony.chordEventToMidiNotes expects:
      root: chordData.root,
      quality: chordData.quality,
      bass: chordData.bass,
      // etc…
    });
  }
  return events;
};


//converts chord events to midi numeral format and adds it to the chord event
export function chordEventsToMidiChords(chordEvents) {
  return chordEvents.map(event => ({
    ...event,
    notes: harmony.chordEventToMidiNotes(event),
  }));
}

//converts midi numeral to midi note on/off event
export function chordEventToTimedMidiEvents(chordEvent, startBeat, durationBeats, secondsAtBeat, rhythmPattern) {
  const notes = harmony.chordEventToMidiNotes(chordEvent);

  //calculates the start and end time in ms
  const startTime = timing.timeAtBeat(startBeat, secondsAtBeat) * 1000;
  const endTime   = timing.timeAtBeat(startBeat + durationBeats, secondsAtBeat) * 1000;

  //generates an array of on/off events
  const events = [];

  for (const note of notes) {
    const rhythm = RHYTHM_PATTERNS[rhythmPattern];

    for (let i = 0; i < rhythm.length; i++) {
        const offset = rhythm[i];

        // Skip hits beyond chord duration
        if (offset >= durationBeats) continue;

        const t = timing.timeAtBeat(startBeat + offset, secondsAtBeat) * 1000;

        // ⭐ Compute next hit time (if it exists)
        let nextBeat = startBeat + (rhythm[i + 1] ?? durationBeats);

        // ⭐ Clamp nextBeat to chord end
        if (nextBeat > startBeat + durationBeats) {
            nextBeat = startBeat + durationBeats;
        }

        const end = timing.timeAtBeat(nextBeat, secondsAtBeat) * 1000;

        events.push({ type: "noteOn", note, time: t });
        events.push({ type: "noteOff", note, time: end });
    }
}


  //sorts the event list by time
  events.sort((a, b) => a.time - b.time);

  return events;
}

//converts all chord events into midi on/off events
export function buildGlobalMidiEventList(chordEvents, secondsAtBeat, rhythmPattern) {
  let globalEvents = [];
  
  //converts midi numerals to on/off events for each chord
  for (const chordEvent of chordEvents) {
    const { startBeat, durationBeats } = chordEvent;

    const events = chordEventToTimedMidiEvents(
      chordEvent,
      startBeat,
      durationBeats,
      secondsAtBeat,
      rhythmPattern
    );

    globalEvents.push(...events);
  }

  //sorts the events by time
  globalEvents.sort((a, b) => a.time - b.time);
  return globalEvents;
}