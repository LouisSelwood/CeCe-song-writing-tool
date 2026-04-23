let audioCtx = null;

/*Operates as a singleton, creating a single intance of Audio Context and returns it to all objects that call it

    Audio context provides a global, sample accurate clock for the entire software
    This is essential for smooth midi playback

*/
export function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    return audioCtx;
}