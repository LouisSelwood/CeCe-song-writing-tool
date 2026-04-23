
export function chordsToString(chords){
    const strChords = chords.map(chord => {

        const strQuality = chord.quality === "major" ?  "" : chord.quality === "minor" ? "m" : chord.quality;
        const strBass = chord.bass === "" ? "" : `/${chord.bass}`
        return `${chord.root}${strQuality}${strBass}`;
    });
    return strChords;
}