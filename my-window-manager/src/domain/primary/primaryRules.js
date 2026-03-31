export async function getSequenceSuggestions(state, chordIDs){
    const chordString = encodeChords(state, chordIDs)
    console.log(chordString)
    const result = await fetch("http://localhost:8000/getlogits?chords=" + encodeURIComponent(chordString));
    const data = await result.json();
    return data;
}

function encodeChords(state, chordIDs){
    let encoded = state.project.currentProject.globalKey + "]";
    chordIDs.forEach(chordID => {
        encoded += ":"
        const chord = state.chords.byID[chordID]
        let root = chord.root;
        if(chord.bass != ""){
            root += "/" + chord.bass
        }
        const quality = chord.quality;
        let key = null
        Object.values(state.sequences.byID).forEach(sequence => {
            if(sequence.chordIDs.includes(chordID)){
                key = sequence.keySignature
            }
        })
        if(key !== null){
            encoded += root + " " + quality + " " + key
        }else{
            throw new Error("Wuh Woh");
            
        }
    })
    encoded += ":"
    return encoded;
}