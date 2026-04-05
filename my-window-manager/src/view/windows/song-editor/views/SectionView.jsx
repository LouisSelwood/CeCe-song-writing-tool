import "../SongEditor.css";
import {Bars} from "../../shared-components/Bars.jsx"
import buildSequences from "../../../components/buildSequences.jsx";
import buildSectionTags from "../../../components/buildSectionTags.jsx";
import { ZoomableScrollContainer } from "../../shared-components/ZoomableScrollableContainer.jsx";
import { AddSectionButton } from "../../shared-components/Buttons/AddSection.jsx";
import { AddSectionInsert } from "../../shared-components/Buttons/AddSectionInsert.jsx";
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
    const sequences = buildSequences(store) 
    const sectionTags = buildSectionTags(store);


    return (
        <ZoomableScrollContainer store={store} contentWidth={totalWidth} baseWidth={baseWidth}>
            <Bars state={store.state}/>
            <div className="sequence-holder">
                {sectionTags}
                {sequences}
                {AddSectionButton({store})}
                {AddSectionInsert({store})}


            </div>
        </ZoomableScrollContainer>
    );
}
