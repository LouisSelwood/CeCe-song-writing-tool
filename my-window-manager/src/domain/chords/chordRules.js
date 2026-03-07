class ChordSegment {
    constructor({
        id,
        root,          // "C", "D#", "Gb"
        quality,       // "maj7", "min", "dim", "sus4", etc.
        bass, 
        duration,  //in bars, how long the chord lasts
        metadata = {}, // optional: user notes, tags, model confidence, etc.
        }) {
        this.id = id;
        this.root = root;
        this.quality = quality;
        this.bass = bass;
        this.duration = duration;
        this.metadata = metadata;
    }


    toString() {
        const strQuality = this.quality === "Major" ? "" : this.quality;
        const strBass = this.bass === "" ? "" : `/${this.bass}`
        return `${this.root}${strQuality}${strBass}`;
    }

    // --- Serialization ---

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

    static deserialize(data) {
        return new ChordSegment(data);
  }
}

function generateID() {
    return "cho-" + Math.random().toString(36).slice(2);
}

export function createChord(params){ //params are root, quality, bass, and duration
    const newChord = new ChordSegment({id: generateID(), ...params})
    return {id: newChord.id, chord: newChord.serialize()};
}

export function getChordAsString(chordID,state){
    const chord = ChordSegment.deserialize(state.chords.byID[chordID]);
    return chord.toString();
}
