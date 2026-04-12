// Theory Information
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const BASE_OCTAVE = 4; // C4
const SEMITONES_PER_OCTAVE = 12;

// NOTE: right now these are all the software handles, however the software architecture allows for extensions for later development
const CHORD_INTERVALS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dim:   [0, 3, 6],
  "7":   [0, 4, 7, 10],
  maj7:  [0, 4, 7, 11],
  m7:    [0, 3, 7, 10],
  sus2:  [0, 2, 7],
  sus4:  [0, 5, 7],
  aug:   [0, 4, 8],
};

// parses key signature into root and quality
export function parseKeySignature(keySignature) {
  const [root, quality] = keySignature.split(" ");
  return { root, quality };
}

// Maps note name to semitone
export function noteNameToSemitone(name) {
  return NOTE_NAMES.indexOf(name);
}

// Maps semitone to MIDI number
export function semitoneToMidi(rootSemitone, octave = BASE_OCTAVE) {
  return octave * SEMITONES_PER_OCTAVE + rootSemitone;
}

// Applies inversions where necassary
export function applyBassInversion(notes, bassSemitone) {
  if (!notes.length) return notes;

  // Converts MIDI number to semitone
  const pitchClass = n => ((n % 12) + 12) % 12;

  // Searches for a MIDI note which matches the bass semitone
  let targetIndex = notes.findIndex(n => pitchClass(n) === bassSemitone);

  // If none found (chord does not contain the proposed bass note), manually add bass note
  if (targetIndex === -1) {
    const root = notes[0];
    const rootPc = pitchClass(root);
    const diff = (bassSemitone - rootPc + 12) % 12;
    const bassNote = root + diff - 12; // put it below
    return [bassNote, ...notes];
  }

  // If bass note found, shift the note down until it is the lowest note of the chord
  const targetNote = notes[targetIndex];
  let bassNote = targetNote;
  bassNote -= 12;
  while (bassNote > Math.min(...notes)) {
    bassNote -= 12;
  }

  // Remove the proposed bass note at its original position
  const remaining = notes.filter((_, i) => i !== targetIndex);
  // Return the rebuilt chord
  return [bassNote, ...remaining];
}

// Converts (root, quality, bass) into MIDI numerals
export function chordEventToMidiNotes(chordEvent) {
  // Extract chord information
  let { root, quality, bass } = chordEvent;

  // Convert bass and root to semitones
  root = noteNameToSemitone(root);
  if (bass !== '') {
    bass = noteNameToSemitone(bass);
  }

  // get the correct intervals based on the quality type
  const intervals = CHORD_INTERVALS[quality];
  if (!intervals) return []; // unknown quality

  // converts root to midi numeral
  const rootMidi = semitoneToMidi(root);

  // build root-position chord
  let notes = intervals.map(interval => rootMidi + interval);

  // handle inversion if bass is specified
  if (bass !== '') {
    console.log(bass)
    notes = applyBassInversion(notes, bass);
  }

  return notes;
}

