// Imports Song Space -> MIDI Event dependancies
import { extractChordEventsFromSongSpace, chordEventsToMidiChords, buildGlobalMidiEventList } from "../../data/audio/music/chordExtraction";

export function getProjectNameFromFilePath(filePath){
    const files = filePath.split('\\')
    const file = files.at(-1)
    const fileName = file.split('.').at(0)
    return fileName
    
}

// Gets the global MIDI events from the song space
export function getGlobalMidiEventlist(state){
    const chordEvents = chordEventsToMidiChords(extractChordEventsFromSongSpace(state));
    const globalMidiEvents = buildGlobalMidiEventList(chordEvents, state.editor.songSpace.secondsAtBeat, state.player.currentRhythm)
    return globalMidiEvents;
}