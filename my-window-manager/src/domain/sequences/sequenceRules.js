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

export function addChordAtEnd(sequenceID, chordID, state){
  const sequence = SequenceSegment.deserialize(state.sequences.byID[sequenceID]);
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
