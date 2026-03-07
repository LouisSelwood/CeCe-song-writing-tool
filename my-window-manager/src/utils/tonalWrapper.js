import { Chord, Key, Note} from "tonal";
export function chordsToString(chords){
    const strChords = chords.map(chord => {
        const strQuality = chord.quality === "Major" ? "" : chord.quality;
        const strBass = chord.bass === "" ? "" : `/${chord.bass}`
        return `${chord.root}${strQuality}${strBass}`;
    });
    return strChords;
}


const MAJOR_ROMANS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const MINOR_ROMANS = ["i", "ii°", "III", "iv", "v", "VI", "VII"];

function getRomanForDegree(degree, isMinor) {
  const arr = isMinor ? MINOR_ROMANS : MAJOR_ROMANS;
  return arr[degree] ?? "?";
}


export function chordsToRoman(chords, keyName) {
  const tonic = keyName.split(" ")[0]; // "C Major" → "C"
  const isMinor = keyName.toLowerCase().includes("minor");
  const key = isMinor ? Key.minorKey(tonic) : Key.majorKey(tonic);
  const scale = key.scale; // diatonic notes

  return chords.map(chordName => {
    const chord = Chord.get(chordName);
    const root = chord.tonic;
    if (!root) return "?";

    const normalized = Note.enharmonic(root);

    let degree = scale.indexOf(root);
    if (degree === -1) degree = scale.indexOf(normalized);
    if (degree === -1) return "?";
    return getRomanForDegree(degree, isMinor);
  });
}

