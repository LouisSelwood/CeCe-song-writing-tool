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

    const gain = velocity / 127;

    const voice = instrument.play(note, 0, { gain });

    // ⭐ Store the voice so we can kill it later
    activeVoices.set(note, voice);
  },

  noteOff(note) {
    const voice = activeVoices.get(note);
    if (!voice) return;

    try {
      // Normal stop
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

    activeVoices.delete(note);
  },

  // ⭐ Add a global kill switch for pause/stop
  stopAll() {
    for (const [note, voice] of activeVoices.entries()) {
      try {
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

    activeVoices.clear();
  }
};
