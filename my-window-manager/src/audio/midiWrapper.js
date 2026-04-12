import Soundfont from "soundfont-player";
import { getAudioContext } from "./audioContext.js";

let instrument = null;
let activeVoices = new Map(); // note -> voice instance

export async function loadInstrument(name = "acoustic_grand_piano") {
  const audioCtx = getAudioContext();
  instrument = await Soundfont.instrument(audioCtx, name);
  console.log("Loaded instrument:", name);
}

export const midiOutput = {
  noteOn(note, velocity = 100) {
    if (!instrument) return;

    const gain = velocity / 127; // Soundfont-player uses 0–1 gain

    const voice = instrument.play(note, 0, { gain });
    activeVoices.set(note, voice);
  },

  noteOff(note) {
    const voice = activeVoices.get(note);
    if (voice) {
      voice.stop();
      activeVoices.delete(note);
    }
  }
};
