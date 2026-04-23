// Defines the shape and attributes of sequence objects
export class SequenceSegment {
    constructor({
        id,
        /*
            Each Sequence object holds their own
            - tempo
            - key
            - time signature
            rather than having them globally set
        */
        tempo,
        keySignature,
        timeSignature,
        rhythm,
        name = "Sequence",
        chordIDs = [],
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

  // Domain Behaviour

  generateNewID(){
    this.id = "seq-" + Math.random().toString(36).slice(2);
  }

  addMetadata(subtitle, data){
    if(subtitle === "explanation"){
      this.metadata[subtitle] = data;
    }
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

  // Sequence Object -> State Object

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

  // State Object -> Sequence Object
  static deserialize(data) {
    return new SequenceSegment(data);
  }
}

function generateID() {
  return "seq-" + Math.random().toString(36).slice(2);
}

// Creates an empty sequence object, with tempo, time signature, rhythm, and key signature attributes
export function createEmptySequence({tempo, timeSignature, rhythm, keySignature}){
  const newSequence = new SequenceSegment({id: generateID(), tempo, timeSignature, rhythm, keySignature});
  return {id: newSequence.id, sequence: newSequence.serialize()};
}

// Duplicates a sequence and returns the empty copy to be populated by the state
export function duplicateSequence(sequence){
  const newSequence = SequenceSegment.deserialize(sequence);
  newSequence.generateNewID();
  newSequence.emptyChordIDs();
  return newSequence.serialize();
}

// Appends a given chord at the end of the given sequence
export function addChordAtEnd(sequenceObj, chordID){
  const sequence = SequenceSegment.deserialize(sequenceObj);
  sequence.addChordAtEnd(chordID);
  return sequence.serialize();
}

// Appends a given chord at the end of the given sequence at Pos
export function addChordAtPos(sequenceID, chordID, pos, state){
  const sequence = SequenceSegment.deserialize(state.sequences.byID[sequenceID]);
  sequence.addChordAtPos(chordID, pos);
  return sequence.serialize();
}

// Returns all chord objects belonging to the given sequence
export function getChords(sequenceID, state){
  const sequence = SequenceSegment.deserialize(state.sequences.byID[sequenceID]);
  let chords = [];
  sequence.getChordIDs().forEach((chordID) => {
    chords.push(state.chords.byID[chordID]);
  })
  return chords;
}

// Adds/Rewrites the given metadata of the given sequence object
export function addMetadata(state, sequenceID, title, data){
  const sequence = SequenceSegment.deserialize(state.sequences.byID[sequenceID]);
  sequence.addMetadata(title, data);
  return sequence.serialize();

}

