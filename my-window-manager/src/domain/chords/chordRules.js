// Defines the Chord Object shape
class ChordSegment {
    constructor({
        id,             // Unique ID
        root,           // Standrard root note of the chord
        quality,        // major|minor|dim|7|maj7|m7|sus2|sus4|aug
        bass,           // Bass note of chord
        duration,       // in bars, fractional, how long the chord lasts
        metadata = {},  // Contains all necessary metadata towards the chord
        }) {
        this.id = id;
        this.root = root;
        this.quality = quality;
        this.bass = bass;
        this.duration = duration;
        this.metadata = metadata;
    }
    // Generates and applies new ID for the chord object
    generateNewID(){
        this.id = "cho-" + Math.random().toString(36).slice(2);
    }

    // Converts the chor from obj -> string
    toString() {
        const chord = state.chords.byID[chordID]
        const strQuality = chord.quality === "major" ? "" : chord.quality === "minor" ? "m" : chord.quality;
        const strBass = chord.bass === "" ? "" : `/${chord.bass}`
        return `${chord.root}${strQuality}${strBass}`;
    }

    // Chord Object -> State Object
    serialize() {
    return {
        id: this.id,
        root: this.root,
        quality: this.quality,
        bass: this.bass,
        duration: this.duration,
        metadata: { ...this.metadata },
    };
    }

    // State Object -> Chord Object
    static deserialize(data) {
        return new ChordSegment(data);
  }
}

function generateID() {
    return "cho-" + Math.random().toString(36).slice(2);
}

// Creates brand new chord object based on params
export function createChord(params){ //params are root, quality, bass, and duration
    const newChord = new ChordSegment({id: generateID(), ...params})
    return {id: newChord.id, chord: newChord.serialize()};
}

// Duplicates given chord object, changing ID
export function duplicateChord(chordID, state){
    const chord = state.chords.byID[chordID]
    const newChord = ChordSegment.deserialize(chord);
    newChord.generateNewID();
    return newChord.serialize();
}

// Returns given chord as its string format
export function getChordAsString(chordID,state){
    const chord = ChordSegment.deserialize(state.chords.byID[chordID]);
    return chord.toString();
}
