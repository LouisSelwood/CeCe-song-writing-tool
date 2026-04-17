import { useRef, useEffect } from "react";
import { WorkshopBars } from "./workshop-bars/WorkshopBars";
import { ChordBlock } from "./ChordBlock";
import { NewChordBlock } from "./NewChordBlock";
import { InsertChordButton } from "./InsertChordButton";
import { AddChordButton } from "./AddChordButton";
import tickIcon from "../../../assets/icons/tick.png"
import "./chordEditor.css";

export function ChordEditor({ store }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        function handleClickOff(e) {

            // Only unselect if click is inside the SongEditor
            const editor = document.querySelector(".chord-editor-container");
            if (!editor) return;

            const clickInsideEditor = editor.contains(e.target);
            if (!clickInsideEditor) return; // ignore clicks outside the editor entirely


            // Ignore clicks on interactive elements
            if (e.target.closest(".chord-block")) return;

            // Clear selection only if click is inside editor AND not on interactive UI
            store.actions.setSelectedChord(null);
            store.actions.setSelectedChordRange([]);
        }

        document.addEventListener("mousedown", handleClickOff);
        return () => document.removeEventListener("mousedown", handleClickOff);
    }, []);

    const state = store.state;
    const ws = state.workshop;
    const songSpace = ws.songSpace;


    const zoom = ws.zoomLevel;
    const scrollX = ws.scrollX;

    const beatWidth = 40 * zoom; // base width per beat
    const player = state.player.workshopPlayer;
    const playheadLeft = player.currentBeat * beatWidth - scrollX
    const totalBeats = songSpace.totalBeats;

    // --- Handle wheel zoom + scroll ---
    function handleWheel(e) {
        if (e.ctrlKey) {
            // Zoom
            const newZoom = ws.zoom * (e.deltaX < 0 ? 1.1 : 0.9);
            store.actions.setWorkshopZoom(newZoom);
        } else {
            // Scroll
            const newScroll = ws.scrollX + e.deltaX;
            store.actions.setWorkshopScroll(newScroll);
        }
    }

    useEffect(() => {
        const resize = ws.chordResize;
        if (resize.active) {
            const { x } = store.state.windows.mousePos;
            store.actions.updateChordResize(x);
            return;
        }

        const drag = ws.chordDrag;
        if (drag.active) {
            const { x, y } = store.state.windows.mousePos;
            store.actions.updateChordDrag(x, y);
        }
    }, [store.state.windows.mousePos.x, store.state.windows.mousePos.y]);

    useEffect(() => {
        function handleMouseUp() {
            if (ws.chordResize.active) {
                store.actions.commitChordResize();
            }
            if (ws.chordDrag.active) {
                store.actions.commitChordDrag();
            }
        }

        window.addEventListener("mouseup", handleMouseUp);
        return () => window.removeEventListener("mouseup", handleMouseUp);
    }, []);

    
    // --- Render chord blocks ---
    const chordBlocks = Object.values(songSpace.objects).map(obj => (
        <ChordBlock
            key={obj.id}
            store={store}
            obj={obj}
        />
    ));

    function handleClickSetPosition(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left + scrollX;
        const beat = Math.floor(x / beatWidth);

        store.actions.wsSetPlayerPosition(beat);
    }


    return (
        <div
            className="chord-editor-container"
            onWheel={handleWheel}
            onClick={handleClickSetPosition}

            ref={canvasRef}
        >
            <div
                className="chord-editor-playhead"
                style={{ left: playheadLeft }}
            />
            <WorkshopBars workshop={ws} />
            <div
                className="chord-editor-content"
                style={{
                    width: songSpace.totalBeats * beatWidth
                }}
            >
                <InsertChordButton store={store}/>
                
                {chordBlocks}
                <AddChordButton store={store}/>
                {ws.newChordPos !== null && (
                    <>
                        {ws.newChordSelected.chordName !== null && (
                            <div 
                                className="new-chord-button" 
                                style={{left: ((ws.newChordPos + (ws.newChordLength/2)) * beatWidth) - ws.scrollX, top: "0px"}}
                                onClick={()=>{store.actions.commitNewChord()}}
                            >
                                <img src={tickIcon} alt="tick" style={{height: "60%", width: "60%"}}/>
                            </div>

                        )}
                        <NewChordBlock store={store}/>
                        <div 
                            className="new-chord-button" 
                            style={{left: ((ws.newChordPos + (ws.newChordLength/2)) * beatWidth) - ws.scrollX, bottom: "0px"}}
                            onClick={()=>{store.actions.cancelNewChord()}}
                        >
                            X
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
