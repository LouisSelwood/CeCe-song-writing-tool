export function buildWorkshopBars(songSpace, zoomLevel, beatWidth) {
    const bars = [];

    const showBeats = zoomLevel > 3;
    const sparseBars = zoomLevel < 0.5;

    const beatsPerBar = songSpace.timeSig?.numerator ?? 4;

    const beatEntries = Object.entries(songSpace.beats)
        .map(([beatIndex, beatData]) => ({
            beatIndex: Number(beatIndex),
            ...beatData
        }))
        .sort((a, b) => a.beatIndex - b.beatIndex);

    if (beatEntries.length === 0) {
        const beatsPerBar = songSpace.timeSig?.numerator ?? 4;

        // Generate 10 empty bars starting at beat 0
        for (let i = 0; i < 10; i++) {
            const barStartBeat = i * beatsPerBar;

            bars.push({
                barStart: true,
                beatIndex: barStartBeat,
                time: { min: 0, sec: 0 }
            });

            if (zoomLevel > 3) {
                for (let b = 1; b < beatsPerBar; b++) {
                    bars.push({
                        barStart: false,
                        beatIndex: barStartBeat + b,
                        time: { min: 0, sec: 0 }
                    });
                }
            }
        }

        return bars;
    }


    let currBar = 0;

    // --- Normal bar generation ---
    beatEntries.forEach((beat) => {
        if (showBeats) {
            bars.push({
                barStart: beat.barStart ?? false,
                beatIndex: beat.beatIndex,
                time: beat.time ?? { min: 0, sec: 0 }
            });
        } else if (sparseBars) {
            if (beat.barStart) {
                currBar += 1;
                if (currBar % 4 === 0) {
                    bars.push({
                        barStart: true,
                        beatIndex: beat.beatIndex,
                        time: beat.time ?? { min: 0, sec: 0 }
                    });
                }
            }
        } else {
            if (beat.barStart) {
                bars.push({
                    barStart: true,
                    beatIndex: beat.beatIndex,
                    time: beat.time ?? { min: 0, sec: 0 }
                });
            }
        }
    });

    // --- Add 10 full bars at the end ---
    const lastBarStart = bars
        .filter(b => b.barStart)
        .map(b => b.beatIndex)
        .pop() ?? 0;

    for (let i = 1; i <= 10; i++) {
        const barStartBeat = lastBarStart + i * beatsPerBar;

        // Add the barStart
        bars.push({
            barStart: true,
            beatIndex: barStartBeat,
            time: { min: 0, sec: 0 }
        });

        // Add beats inside the bar (if zoom allows)
        if (showBeats) {
            for (let b = 1; b < beatsPerBar; b++) {
                bars.push({
                    barStart: false,
                    beatIndex: barStartBeat + b,
                    time: { min: 0, sec: 0 }
                });
            }
        }
    }

    return bars;
}
