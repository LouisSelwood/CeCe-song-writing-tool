class ChordSegment {
    constructor({
        id,
        root,          // "C", "D#", "Gb"
        quality,       // "maj7", "min", "dim", "sus4", etc.
        extensions = [], // ["9", "#11"] etc.
        duration = 1,  // in bars
        inversion = 0, // 0 = root position, 1 = first inversion, etc.
        metadata = {}, // optional: user notes, tags, model confidence, etc.
        }) {
        this.id = id;
        this.root = root;
        this.quality = quality;
        this.extensions = extensions;
        this.duration = duration;
        this.inversion = inversion;
        this.metadata = metadata;
    }

    // --- Domain behaviour ---

    transpose(semitones) {
        this.root = transposeNote(this.root, semitones);
        // extensions stay the same
    }

    setDuration(beats) {
        this.duration = beats;
    }

    setInversion(inv) {
        this.inversion = inv;
    }

    toString() {
        return `${this.root}${this.quality}${this.extensions.join("")}`;
    }

    // --- Serialization ---

    serialize() {
    return {
        id: this.id,
        root: this.root,
        quality: this.quality,
        extensions: [...this.extensions],
        duration: this.duration,
        inversion: this.inversion,
        timing: this.timing ? { ...this.timing } : null,
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

export function createChord(params){ //params are root, quality and extensions
    const newChord = new ChordSegment({id: generateID(), ...params})
    return {id: newChord.id, chord: newChord.serialize()};
}

export function duplicateChord(state, chordID) {
    const newChord = ChordSegment.deserialize({...state.chords.byID[chordID], id: generateID()})
    return {id: newChord.id, chord: newChord.serialize()}
}