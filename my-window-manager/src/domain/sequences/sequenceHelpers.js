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


