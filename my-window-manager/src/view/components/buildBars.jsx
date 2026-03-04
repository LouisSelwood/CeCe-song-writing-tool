import "../windows/song-editor/SongEditor.css";

export default function buildBars(songspace, beatWidth, zoomLevel) {
    const bars = [];

    const showBeats = zoomLevel > 3;
    const sparseBars = zoomLevel < 0.2;

    let globalBarIndex = 0; // continuous bar counter across sequences

    songspace.forEach((seq, seqIndex) => {
        const beatsPerBar = seq.timeSignature.numerator;
        const totalBeats = seq.endBeat - seq.startBeat;
        const numBars = Math.floor(totalBeats / beatsPerBar);

        for (let b = 0; b <= numBars; b++) {
            const barStartBeat = seq.startBeat + b * beatsPerBar;
            const barX = barStartBeat * beatWidth * zoomLevel;

            // global rule: show only every 4th bar when zoomed out
            const showBar = !sparseBars || (globalBarIndex % 4 === 0);

            if (showBar) {
                bars.push(
                    <div
                        key={`bar-${seqIndex}-${b}`}
                        className="songspace-bar-line"
                        style={{ left: barX }}
                    />
                );
            }

            // beat lines only when zoomed in AND bar is visible
            if (showBeats && showBar) {
                for (let beat = 1; beat < beatsPerBar; beat++) {
                    const beatStart = barStartBeat + beat;
                    const beatX = beatStart * beatWidth * zoomLevel;

                    bars.push(
                        <div
                            key={`beat-${seqIndex}-${b}-${beat}`}
                            className="songspace-beat-line"
                            style={{ left: beatX }}
                        />
                    );
                }
            }

            globalBarIndex++; // increment across sequences
        }
    });

    return bars;
}