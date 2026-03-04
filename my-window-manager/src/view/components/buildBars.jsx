export default function buildBars(songspace, beatWidth, zoomLevel){
    const bars = [];

    songspace.forEach((seq, seqIndex) => {
        const beatsPerBar = seq.timeSignature.numerator;
        const totalBeats = seq.endBeat - seq.startBeat;
        const numBars = Math.floor(totalBeats / beatsPerBar);
        for (let b = 0; b <= numBars; b++) {
            const barStartBeat = seq.startBeat + b * beatsPerBar;
            const barX =
                barStartBeat *
                beatWidth *
                zoomLevel;

            bars.push(
                <div
                    key={`${seqIndex}-${b}`}
                    className="songspace-bar-line"
                    style={{ left: barX }}
                />
            );
        }
    });
    return bars;

}
