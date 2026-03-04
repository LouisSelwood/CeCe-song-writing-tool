
import buildBars from "../../components/buildBars.jsx";
import { ZoomableScrollContainer } from "../shared-components/ZoomableScrollableContainer.jsx";
import {useState, useRef, useEffect, useLayoutEffect} from "react";

export function SectionView({ store }) {
    const [editorState, setEditorState] = useState(store.state.editor)
    useEffect(() => {
        const unsub = store.subscribe(() => {
            setEditorState(store.state.editor);
        });
        return unsub;
    }, [store.state.editor]);
    const baseWidth = store.selectors.editor.selectBaseWidth(store.state);
    const totalWidth = baseWidth * editorState.zoomLevel;

    const songspace = store.selectors.editor.selectSongSpace(store.state);
    const bars = buildBars(songspace, editorState.beatWidth, editorState.zoomLevel);

    return (
        <ZoomableScrollContainer store={store} contentWidth={totalWidth} baseWidth={baseWidth}>
            {bars}
        </ZoomableScrollContainer>
    );
}
