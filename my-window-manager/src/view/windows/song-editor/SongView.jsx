import "./SongEditor.css";
import {useState, useRef, useEffect, useLayoutEffect} from "react";
export function SongView({ store }) {
    
    //subscribes to the editor store
    const [editorState, setEditorState] = useState(store.state.editor);
    useEffect(() => {
        const unsub = store.subscribe(() => {
            setEditorState(store.state.editor);
        });
        return unsub;
    }, [store]);

    const baseWidth = store.selectors.editor.selectBaseWidth(store.state);    //base width of the song space
    const totalWidth = baseWidth * editorState.zoomLevel;                     //width of the song factoring in zoom level

    //references needed as these values need to be accessable in a useEffect which only updates on load
    const zoomRef = useRef(editorState.zoomLevel);
    const zoomStrengthRef = useRef(editorState.zoomStrengthRef);
    const baseWidthRef = useRef(baseWidth);
    useLayoutEffect(() => {
        zoomRef.current = editorState.zoomLevel;
        zoomStrengthRef.current = editorState.zoomStrength;
        baseWidthRef.current = baseWidth;
    }, [editorState, baseWidth]);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const oldZoom = zoomRef.current;

        const centerX = container.clientWidth / 2;
        const centerBeat = (container.scrollLeft + centerX) / oldZoom;

        container.scrollLeft = centerBeat * oldZoom - centerX;
    }, [baseWidth]);


    //triggered once on load, creates events to listen for zooming.
    useEffect(() => {
        function handleZoom(e) {
            if (e.ctrlKey){
                const viewportWidth = containerRef.current.clientWidth;
                const ZOOM_IN = 1 + zoomStrengthRef.current;
                const ZOOM_OUT = 1 - zoomStrengthRef.current;
                if (e.deltaY < 0) {
                    lineUpScroll(e, ZOOM_IN);
                    store.actions.setZoom(zoomRef.current * ZOOM_IN)
                } else {
                    // Calculates the  new width after zoom out applied
                    const newZoom = zoomRef.current * ZOOM_OUT;
                    const newTotalWidth = baseWidthRef.current * newZoom;

                    //Checks if zoom out would make the new width smaller than the view width
                    if (newTotalWidth > viewportWidth) {
                        lineUpScroll(e, ZOOM_OUT);
                        store.actions.setZoom(zoomRef.current * ZOOM_OUT)
                    }else{
                        //sets zoom so that view width = song width
                        const fitZoom = viewportWidth/baseWidthRef.current;
                        store.actions.setZoom(fitZoom);
                    }
                }

            }
        }
        //applies zoom balancing
        function lineUpScroll(e, zoomStrength){
            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            const cursorX = e.clientX - rect.left;
            const timelineX = (container.scrollLeft + cursorX) / zoomRef.current;
            const newZoom = zoomRef.current * zoomStrength;
            const newScrollLeft = timelineX * newZoom - cursorX;
            containerRef.current.scrollLeft = newScrollLeft;
        }
        //adds a zoom listener (checks both mouse and track pad zoom)
        window.addEventListener("wheel", handleZoom, {passive: false})
        
        return () => window.removeEventListener("wheel", handleZoom);

    }, []);



    const bars = [];
    const songspace = store.selectors.editor.selectSongSpace(store.state);

    songspace.forEach((seq, seqIndex) => {
        const beatsPerBar = seq.timeSignature.numerator;
        const totalBeats = seq.endBeat - seq.startBeat;
        const numBars = Math.floor(totalBeats / beatsPerBar);

        for (let b = 0; b <= numBars; b++) {
            const barStartBeat = seq.startBeat + b * beatsPerBar;

            const barX =
                barStartBeat *
                editorState.beatWidth *
                editorState.zoomLevel;

            bars.push(
                <div
                    key={`${seqIndex}-${b}`}
                    className="songspace-bar-line"
                    style={{ left: barX }}
                />
            );
        }
    });


    //references for components
    const contentRef = useRef(null);
    const containerRef = useRef(null);
    
    return (
        <div className="songspace-container" ref={containerRef}> {/*Scrollable Area */}
            <div
                ref={contentRef}
                className="songspace-content"
                style={{ width: totalWidth }}
            >
                {bars}
            </div>
        </div>
    );
}