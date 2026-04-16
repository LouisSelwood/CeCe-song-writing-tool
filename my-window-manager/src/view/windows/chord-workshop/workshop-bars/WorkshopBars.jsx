import "./workshopBars.css";
import { buildWorkshopBars } from "./BuildWorkshopBars";

export function WorkshopBars({ workshop }) {
    const songSpace = workshop.songSpace;
    const zoom = workshop.zoomLevel;
    const scrollX = workshop.scrollX;

    if (!songSpace) return null;

    const beatWidth = 40 * zoom;

    const bars = buildWorkshopBars(songSpace, zoom);

    return (
        <div className="workshop-bars-layer">
            {bars.map((bar) => {
                const left = (bar.beatIndex * beatWidth) - scrollX;

                return (
                    <div
                        key={bar.beatIndex}
                        className={bar.barStart ? "ws-bar-line" : "ws-beat-line"}
                        style={{ left }}
                    >
                        {bar.barStart && (
                            <div className="ws-bar-label">
                                {bar.beatIndex}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
