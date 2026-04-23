// Imports primary and secondary model interfaces
import { primaryModel } from "../../data/ai/PrimaryModel.js"
import { secondaryModel } from "../../data/ai/SecondaryModel.js";

// Gets an array of possible chords given a previous sequence of chords
export async function getSequenceSuggestions(state, chordIDs){
    return await primaryModel.getSequenceSuggestions(state, chordIDs);
}

// Gets an array of possible starting chords given an initial key and mode
export async function getEmptySequenceSuggestions(state){
    return await primaryModel.getEmptySequenceSuggestions(state)
}

// Generates a semantic explanation on a given chord sequence
export async function getExplanation(sequenceID, state, domain) {
    const sequence = state.sequences.byID[sequenceID];

    // Gets secondary model prompt
    let progression =  "Chord Progression: ";
    for (const c of sequence.chordIDs) {
        progression += domain.chords.getChordAsString(c, state) + " ";
    }
    progression += "  Key: " + sequence.keySignature

    // Fetches data and returns
    const data = await secondaryModel.getExplanationOfSequence(progression);
    return data;
}

