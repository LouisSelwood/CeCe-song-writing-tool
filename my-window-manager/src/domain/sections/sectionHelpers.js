//Gets the start position of the previous section, used in the "Rewind" feature.
export function getPreviousSectionBeat(state) {
    const beat = state.editor.playheadPosition;
    const songSpace = state.editor.songSpace;

    if (!songSpace || !songSpace.objects) return 0;

    // Extract section objects
    const sections = Object.values(songSpace.objects)
        .filter(obj => obj.type === "section" || obj.type === "emptySection");

    // Find the closest section BEFORE the playhead
    const prev = sections
        .filter(sec => sec.startBeat < beat)
        .sort((a, b) => b.startBeat - a.startBeat)[0];

    return prev ? prev.startBeat : 0;
}

// Gets the start beat of the next section in the song, used in "Fast Forward" feature
export function getNextSectionBeat(state) {
    const beat = state.editor.playheadPosition;
    const songSpace = state.editor.songSpace;

    if (!songSpace || !songSpace.objects) return beat;

    // Extract section objects
    const sections = Object.values(songSpace.objects)
        .filter(obj => obj.type === "section" || obj.type === "emptySection");

    // Find the closest section AFTER the playhead
    const next = sections
        .filter(sec => sec.startBeat > beat)
        .sort((a, b) => a.startBeat - b.startBeat)[0];

    return next ? next.startBeat : beat;
}
