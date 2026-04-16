export const getSelectedKey = (state) => {
    if(state.editor.selectedSequenceID === null) return;
    const sequence = state.sequences.byID[state.editor.selectedSequenceID];
    return sequence.keySignature;
}

export const getSelectedTempo = (state) => {
    if(state.editor.selectedSequenceID === null) return;
    const sequence = state.sequences.byID[state.editor.selectedSequenceID];
    return sequence.tempo;
}

export const getSelectedTimeSignature = (state) => {
    if(state.editor.selectedSequenceID === null) return ["dun","dun"];
    const sequence = state.sequences.byID[state.editor.selectedSequenceID];
    return [sequence.timeSignature.numerator, sequence.timeSignature.denominator];
}

export const parseChordName = (chordName) => {
    // 1. Split slash chord
    const [main, bass] = chordName.split("/");

    // 2. Extract root + quality
    const match = main.match(/^([A-G][b#]?)(.*)$/);
    if (!match) {
        return null; // invalid chord
    }

    const root = match[1];
    let quality = match[2]; // e.g. "", "m", "7", "m7", "sus2", "aug"

    // 3. Allowed qualities based on your engine
    const allowedQualities = new Set([
        "",          // major triad
        "m",         // minor triad
        "dim",       // diminished triad
        "aug",       // augmented triad
        "7",         // dominant 7
        "m7",        // minor 7
        "maj7",      // major 7
        "m7b5",      // half-diminished
        "sus2",
        "sus4"
    ]);

    if (!allowedQualities.has(quality)) {
        return null; // unsupported chord type
    }

    if (quality === "") {
        quality = "major";
    } else if (quality === "m") {
        quality = "minor";
    }

    // 4. Validate bass note if present
    if (bass && !/^[A-G][b#]?$/.test(bass)) {
        return null;
    }

    return {
        chordName,
        root,
        quality,
        bass: bass || ""
    };
}
