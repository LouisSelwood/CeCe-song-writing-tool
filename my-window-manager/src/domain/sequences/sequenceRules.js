import { getChordAsString } from "./sequenceHelpers";

const format = `
f"""You are a concise music theory assistant.
You never add extra commentary or text outside the JSON.
You analyse each chord in the context of the full progression, not in isolation.

Chord progression: {chords}
Key: {key}

For each chord explain why it follows the PREVIOUS chord, not just what it is.
The first chord should explain its role as the starting chord.

Respond only in a valid JSON array, no text before or after:
[
  {{
    "chord": "chord name",
    "reason": "max 10 words, why it follows the previous chord",
    "concept": "one music theory term"
  }}

Now Analyse
]"""
`

export class SequenceSegment {
  constructor({
    id,
    tempo,
    keySignature,
    timeSignature,
    rhythm,
    name = "Sequence",
    chordIDs = [],     // children (by ID)
    metadata = {},    
  }) {
    this.id = id;
    this.tempo = tempo;
    this.keySignature = keySignature;
    this.timeSignature = timeSignature;
    this.rhythm = rhythm;
    this.name = name;
    this.chordIDs = chordIDs;
    this.metadata = metadata;
  }

  // --- Domain behaviour ---

  generateNewID(){
    this.id = "seq-" + Math.random().toString(36).slice(2);
  }

  emptyChordIDs(){
    this.chordIDs = [];
  }

  getChordIDs(){
    return this.chordIDs;
  }

  moveChord(chordID, pos) {
    const currentIndex = this.chordIDs.indexOf(chordID);
    if (currentIndex === -1) return;

    this.chordIDs.splice(currentIndex, 1);
    const newPos = Math.max(0, Math.min(pos, this.chordIDs.length));
    this.chordIDs.splice(newPos, 0, chordID);
  }

  addChordAtEnd(chordID) {
    this.chordIDs.push(chordID);
  }

  addChordAtPos(chordID, pos) {
    const newPos = Math.max(0, Math.min(pos, this.chordIDs.length));
    this.chordIDs.splice(newPos, 0, chordID);
  }

  removeChord(chordID) {
    const index = this.chordIDs.indexOf(chordID);
    if (index !== -1) {
      this.chordIDs.splice(index, 1);
    }
  }

  // --- Serialization ---

  serialize() {
    return {
      type: "ChordSequenceSegment",
      id: this.id,
      tempo: this.tempo,
      keySignature: this.keySignature,
      timeSignature: this.timeSignature,
      rhythm: this.rhythm,
      name: this.name,
      chordIDs: [...this.chordIDs],
      metadata: { ...this.metadata },
    };
  }

  static deserialize(data) {
    return new SequenceSegment(data);
  }
}

function generateID() {
  return "seq-" + Math.random().toString(36).slice(2);
}

export function createEmptySequence({tempo, timeSignature, rhythm, keySignature}){
  const newSequence = new SequenceSegment({id: generateID(), tempo, timeSignature, rhythm, keySignature});
  return {id: newSequence.id, sequence: newSequence.serialize()};
}

export function duplicateSequence(sequence){
  const newSequence = SequenceSegment.deserialize(sequence);
  newSequence.generateNewID();
  newSequence.emptyChordIDs();
  return newSequence.serialize();
}

export function addChordAtEnd(sequenceObj, chordID){
  const sequence = SequenceSegment.deserialize(sequenceObj);
  sequence.addChordAtEnd(chordID);
  return sequence.serialize();
}

export function addChordAtPos(sequenceID, chordID, pos, state){
  const sequence = SequenceSegment.deserialize(state.sequences.byID[sequenceID]);
  sequence.addChordAtPos(chordID, pos);
  return sequence.serialize();
}

export function getChords(sequenceID, state){
  const sequence = SequenceSegment.deserialize(state.sequences.byID[sequenceID]);
  let chords = [];
  sequence.getChordIDs().forEach((chordID) => {
    chords.push(state.chords.byID[chordID]);
  })
  return chords;
}

export function getPreviousSequenceBeat(state) {
    const beat = state.editor.playheadPosition;
    const songSpace = state.editor.songSpace;

    if (!songSpace || !songSpace.objects) return 0;

    // Extract sequence objects
    const sequences = Object.values(songSpace.objects)
        .filter(obj => obj.type === "sequence");

    // Find the closest sequence BEFORE the playhead
    const prev = sequences
        .filter(seq => seq.startBeat < beat)
        .sort((a, b) => b.startBeat - a.startBeat)[0];

    return prev ? prev.startBeat : 0;
}


export function getNextSequenceBeat(state) {
    const beat = state.editor.playheadPosition;
    const songSpace = state.editor.songSpace;

    if (!songSpace || !songSpace.objects) return beat;

    // Extract sequence objects
    const sequences = Object.values(songSpace.objects)
        .filter(obj => obj.type === "sequence");

    // Find the closest sequence AFTER the playhead
    const next = sequences
        .filter(seq => seq.startBeat > beat)
        .sort((a, b) => a.startBeat - b.startBeat)[0];

    return next ? next.startBeat : beat;
}


export async function getExplanation(sequenceID, state) {
    const sequence = state.sequences.byID[sequenceID];

    let progression =  "Chord Progression: ";
    for (const c of sequence.chordIDs) {
        progression += getChordAsString(state, c) + " ";
    }
    progression += "  Key: " + sequence.keySignature

    console.log(progression)
    const prompt = format + progression;

    const result = await fetch("http://localhost:8000/explain?chords=" + encodeURIComponent(prompt));

    const data = await result.json();

    const newSequence = SequenceSegment.deserialize(sequence.serialize());
    newSequence.metadata["explanation"] = data;
}
