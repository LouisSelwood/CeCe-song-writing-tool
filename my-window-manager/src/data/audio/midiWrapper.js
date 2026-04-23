//import dependancies
import Soundfont from "soundfont-player"; //Uses soundfont, for its ability to support multiple instruments
import { getAudioContext } from "./audioContext.js";


let instrument = null;
let activeVoices = new Map(); // stores voice data for each note currently playing (acts as the MIDI sound space)

//An access point for the software to change the active GM instrument
export async function loadInstrument(name) {
    const audioCtx = getAudioContext();
    instrument = await Soundfont.instrument(audioCtx, name);
    console.log("Loaded instrument:", name);
}

//Acts as a wrapper, used abstract MIDI commands for the rest of the software.
export const midiOutput = {

    //Activate a MIDI note
    noteOn(note, velocity = 100) {
        if (!instrument) return;

        const gain = velocity / 127;

        const voice = instrument.play(note, 0, { gain });

        //Saves the note voice to map
        activeVoices.set(note, voice);
    },
    
    //Turns off a MIDI note
    noteOff(note) {
        //Gets the voice for the note
        const voice = activeVoices.get(note);

        if (!voice) return;  //Checks if note is active, if so there is no need to deactivate it

        try {
            //stops the note
            voice.stop();

            //stop the note from ringing out on stop
            if (voice.gain && voice.gain.gain) {
                voice.gain.gain.cancelScheduledValues(0);
                voice.gain.gain.setValueAtTime(0, getAudioContext().currentTime);
            }
            if (voice.output) {
                voice.output.disconnect();
            }

        } catch (err) {
            console.warn("Error stopping voice:", err);
        }
        //removes the voice from the list of active voices
        activeVoices.delete(note);
    },

    //Acts as a global kill function to stop all active notes on MIDI player pause/stop
    stopAll() {
        
        //loop through each active note
        for (const [note, voice] of activeVoices.entries()) {
            try {
                //stops the note and the ringing out
                voice.stop();

                if (voice.gain && voice.gain.gain) {
                    voice.gain.gain.cancelScheduledValues(0);
                    voice.gain.gain.setValueAtTime(0, getAudioContext().currentTime);
                }

                if (voice.output) {
                    voice.output.disconnect();
                }

            } catch (err) {
                console.warn("Error stopping voice:", err);
            }
        }
        //clears all active notes from the map
        activeVoices.clear();
    }
};
