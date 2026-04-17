export async function getSequenceSuggestions(state, chordIDs){
    const chordString = encodeChords(state, chordIDs)
    const result = await fetch("http://localhost:8000/predict_next?chords=" + encodeURIComponent(chordString));
    const data = await result.json();
    return data;
}

export async function getEmptySequenceSuggestions(state){
    const chordString = state.project.currentProject.globalKey + "]" + state.project.currentProject.globalKey + " " + state.project.currentProject.globalKey
    const result = await fetch("http://localhost:8000/predict_next?chords=" + encodeURIComponent(chordString));
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