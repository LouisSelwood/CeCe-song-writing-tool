import "../SongEditor.css";
import {Bars} from "../../shared-components/Bars.jsx"
import buildChords from "../../../components/buildChords.jsx";
import buildSequenceTags from "../../../components/buildSequenceTags.jsx";
import { ZoomableScrollContainer } from "../../shared-components/ZoomableScrollableContainer.jsx";
import {useState, useRef, useEffect, useLayoutEffect} from "react";

export function SequenceView({ store }) {
    const [editorState, setEditorState] = useState(store.state.editor)
    useEffect(() => {
        const unsub = store.subscribe(() => {

            setEditorState(store.state.editor);
        });
        return unsub;
    }, [store]);
    
    const baseWidth = store.selectors.editor.selectBaseWidth(store.state);
    const totalWidth = baseWidth * editorState.zoomLevel;

    const chords = buildChords(store);
    const sequences = buildSequenceTags(store);

    return (
        <ZoomableScrollContainer store={store} contentWidth={totalWidth} baseWidth={baseWidth}>
            <Bars state={store.state}/>
            {sequences}
            {chords}
        </ZoomableScrollContainer>
    );
}
