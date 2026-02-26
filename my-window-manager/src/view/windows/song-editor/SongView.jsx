import "./SongEditor.css";
import {useState, useRef, useEffect} from "react";
export function SongView({ store }) {
    
    //subscribes to the editor store
    const [editorState, setEditorState] = useState(store.state.editor);
    useEffect(() => {
        const unsub = store.subscribe(() => {
            setEditorState(store.state.editor);
        });
        return unsub;
    }, [store]);

    const baseWidth =                                       //base width of the song
        editorState.numBars *
        editorState.beatsPerBar *
        editorState.beatWidth;
    const totalWidth = baseWidth * editorState.zoomLevel;  //width of the song factoring in zoom level

    //references needed as these values need to be accessable in a useEffect which only updates on load
    const zoomRef = useRef(editorState.zoomLevel);
    const zoomStrengthRef = useRef(editorState.zoomStrengthRef);
    const baseWidthRef = useRef(baseWidth);
    useEffect(() => {
        zoomRef.current = editorState.zoomLevel;
        zoomStrengthRef.current = editorState.zoomStrength;
        baseWidthRef.current = baseWidth;
    }, [editorState, baseWidth]);

    //triggered once on load, creates events to listen for zooming.
    useEffect(() => {
        function handleZoom(e) {
            if (e.ctrlKey){
                const viewportWidth = containerRef.current.clientWidth;
                const ZOOM_IN = 1 + zoomStrengthRef.current;
                const ZOOM_OUT = 1 - zoomStrengthRef.current;
                if (e.deltaY < 0) {
                    store.actions.setZoom(zoomRef.current * ZOOM_IN)
                    lineUpScroll(e, ZOOM_IN);
                } else {
                    // Calculates the  new width after zoom out applied
                    const newZoom = zoomRef.current * ZOOM_OUT;
                    const newTotalWidth = baseWidthRef.current * newZoom;

                    //Checks if zoom out would make the new width smaller than the view width
                    if (newTotalWidth > viewportWidth) {
                        store.actions.setZoom(zoomRef.current * ZOOM_OUT)
                        lineUpScroll(e, ZOOM_OUT);
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



    //creates baars
    const bars = [];
    for (let i = 0; i <= editorState.numBars; i++) {
        bars.push(
            <div
                key={i}
                className="songspace-bar-line"
                style={{
                    left:
                    i *
                    editorState.beatsPerBar *
                    editorState.beatWidth *
                    editorState.zoomLevel
                }}
            />
        );
    }


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