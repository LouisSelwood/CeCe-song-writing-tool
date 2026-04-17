export const getChordAsString = (state, chordID) => {
    const chord = state.chords.byID[chordID]
    const strQuality = chord.quality === "major" ? "" : chord.quality === "minor" ? "m" : chord.quality;
    const strBass = chord.bass === "" ? "" : `/${chord.bass}`
    return `${chord.root}${strQuality}${strBass}`;
}