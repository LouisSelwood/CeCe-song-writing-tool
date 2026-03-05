// ZoomableScrollContainer.jsx
import { useRef, useEffect, useLayoutEffect, useState } from "react";

export function ZoomableScrollContainer({ store, children, contentWidth, baseWidth }) {

    // subscribes to the editor store
    const [editorState, setEditorState] = useState(store.state.editor);
    useEffect(() => {
        const unsub = store.subscribe(() => {
            setEditorState(store.state.editor);
        });
        return unsub;
    }, [store]);

    // references needed as these values need to be accessible in a useEffect which only updates on load
    const containerRef = useRef(null);
    const zoomRef = useRef(editorState.zoomLevel);
    const zoomStrengthRef = useRef(editorState.zoomStrength);
    const baseWidthRef = useRef(baseWidth);

    useLayoutEffect(() => {
        zoomRef.current = editorState.zoomLevel;
        zoomStrengthRef.current = editorState.zoomStrength;
        baseWidthRef.current = baseWidth;   // restored to original behaviour
    }, [editorState, baseWidth]);

    // keeps scroll centered when width changes
    useLayoutEffect(() => {
        const container = containerRef.current;
        const oldZoom = zoomRef.current;

        const centerX = container.clientWidth / 2;
        const centerBeat = (container.scrollLeft + centerX) / oldZoom;

        container.scrollLeft = centerBeat * oldZoom - centerX;
    }, [contentWidth]);

    // triggered once on load, creates events to listen for zooming
    useEffect(() => {

        function handleZoom(e) {
            if (e.ctrlKey) {
                e.preventDefault();

                const viewportWidth = containerRef.current.clientWidth;
                const ZOOM_IN = 1 + zoomStrengthRef.current;
                const ZOOM_OUT = 1 - zoomStrengthRef.current;

                if (e.deltaY < 0) {
                    lineUpScroll(e, ZOOM_IN);
                    store.actions.setZoom(zoomRef.current * ZOOM_IN);
                } else {
                    const newZoom = zoomRef.current * ZOOM_OUT;
                    const newTotalWidth = baseWidthRef.current * newZoom;

                    // checks if zoom out would make the new width smaller than the view width
                    if (newTotalWidth > viewportWidth) {
                        lineUpScroll(e, ZOOM_OUT);
                        store.actions.setZoom(newZoom);
                    } else {
                        // sets zoom so that view width = song width
                        const fitZoom = viewportWidth / baseWidthRef.current;
                        store.actions.setZoom(fitZoom);
                    }
                }
            }
        }

        // applies zoom balancing
        function lineUpScroll(e, zoomStrength) {
            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            const cursorX = e.clientX - rect.left;

            const timelineX = (container.scrollLeft + cursorX) / zoomRef.current;
            const newZoom = zoomRef.current * zoomStrength;
            const newScrollLeft = timelineX * newZoom - cursorX;

            container.scrollLeft = newScrollLeft;
        }

        // adds a zoom listener (checks both mouse and track pad zoom)
        window.addEventListener("wheel", handleZoom, { passive: false });

        return () => window.removeEventListener("wheel", handleZoom);

    }, []);

    return (
        <div className="songspace-container" ref={containerRef}> {/* Scrollable Area */}
            <div
                className="songspace-content"
                style={{ width: contentWidth }}
            >
                {children}
            </div>
        </div>
    );
}