export const buildBars = (state) => {
    const songSpace = state.editor.songSpace;
    const zoomLevel = state.editor.zoomLevel;

    const bars = [];

    // UI behaviour flags (optional)
    const showBeats = zoomLevel > 3;
    const sparseBars = zoomLevel < 0.5;
    // Convert beats object → sorted array of beats
    // This ensures we process beats in correct timeline order.
    const beatEntries = Object.entries(songSpace.beats)
    .map(([beatIndex, beatData]) => ({
        beatIndex: Number(beatIndex),
        ...beatData
    })).sort((a, b) => a.beatIndex - b.beatIndex);

    if (beatEntries.length === 0) return bars;

    let currBar = 0;
    // Loop through every beat in the song
    beatEntries.forEach((beat, idx) => {
        if(showBeats){
            if(beat.barStart){
                bars.push({
                    barStart: true,
                    barIndex: idx,
                    time: beat.time,
                });
            }else{
                bars.push({
                    barStart: false,
                    barIndex: idx,
                    time: beat.time,
                });
            }
        }else if(sparseBars){
            if(beat.barStart){
                currBar += 1;
                if(currBar % 4 === 0){
                    bars.push({
                        barStart: true,
                        barIndex: idx,
                        time: beat.time,
                    });
                }
            }
        }
        else{
            if(beat.barStart){
                bars.push({
                    barStart: true,
                    barIndex: idx,
                    time: beat.time,
                });
            }
        }
    });
    return bars;

};