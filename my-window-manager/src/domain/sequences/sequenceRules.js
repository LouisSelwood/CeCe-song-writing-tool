export class SequenceSegment {
  constructor({
    id,
    name = "Sequence",
    chordIDs = [],     // children (by ID)
    metadata = {},    
  }) {
    this.id = id;
    this.name = name;
    this.chordIDs = chordIDs;
    this.metadata = metadata;
  }

  // --- Domain behaviour ---

  getChordIDs(){
    return this.chordIDs;
  }
  initiateChords(initChords){
    this.chordIDs = initChords;
  }
  addChord(chordID) {
    this.chordIDs.push(chordID);
  }

  insertChordAt(index, chordID) {
    this.chordIDs.splice(index, 0, chordID);
  }

  removeChord(chordID) {
    this.chordIDs = this.chordIDs.filter(id => id !== chordID);
  }

  moveChord(chordID, newIndex) {
    const oldIndex = this.chordIDs.indexOf(chordID);
    if (oldIndex === -1) return;

    this.chordIDs.splice(oldIndex, 1);
    this.chordIDs.splice(newIndex, 0, chordID);
  }

  // --- Serialization ---

  serialize() {
    return {
      type: "ChordSequenceSegment",
      id: this.id,
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

export function createEmptySequence(){
  const newSequence = new SequenceSegment({id: generateID()});
  return {id: newSequence.id, sequence: newSequence.serialize()};
}

export function createFullSequence(chordIDs) {
  const newSequence = new SequenceSegment({id: generateID()});
  newSequence.initiateChords(chordIDs);
  return {id: newSequence.id, sequence: newSequence.serialize()};
}

export function duplicateSequence(state, sequenceID){
  const newSequence = SequenceSegment.deserialize({...state.sequences.byID[sequenceID], id: generateID()})
  console.log(`domain chords: ${state.sequences.byID[sequenceID].chordIDs}`)
  console.log(newSequence.serialize())
  return {id: newSequence.id, sequence: newSequence.serialize(), chordIDs: newSequence.getChordIDs()}
}

export function addChord(state, sequenceID, chordID){
  const sequence = SequenceSegment.deserialize(state.sequences.byID[sequenceID]);
  sequence.addChord(chordID)
  return sequence.serialize();
}

export function initiateChords(state, sequenceID, chordIDs){
  const sequence = SequenceSegment.deserialize(state.sequences.byID[sequenceID])
  sequence.initiateChords(chordIDs);
  return sequence.serialize();
}
