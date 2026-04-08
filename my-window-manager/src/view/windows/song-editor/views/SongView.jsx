import "../SongEditor.css";
import {Bars} from "../../shared-components/Bars.jsx"
import buildSections from "../../../components/buildSections.jsx"
import { ZoomableScrollContainer } from "../../shared-components/ZoomableScrollableContainer.jsx";
import { AddSectionButton } from "../../shared-components/Buttons/AddSection.jsx";
import { InsertSectionButton } from "../../shared-components/Buttons/InsertSection.jsx";
import { AddSectionMenu } from "../popups/AddSectionMenu.jsx";
import { InsertSectionMenu } from "../popups/InsertSectionMenu.jsx";
import {useState, useRef, useEffect, useLayoutEffect} from "react";


export function SongView({ store }) {
    const [editorState, setEditorState] = useState(store.state.editor)
    useEffect(() => {
        const unsub = store.subscribe(() => {
            setEditorState(store.state.editor);
        });
        return unsub;
    }, []);
    const baseWidth = store.selectors.editor.selectBaseWidth(store.state);
    const totalWidth = baseWidth * editorState.zoomLevel;
    const sections = buildSections(store);

    return (
        <ZoomableScrollContainer store={store} contentWidth={totalWidth} baseWidth={baseWidth}>
    
            <Bars state={store.state}/>
            <div className="section-holder">
                {sections}
                <AddSectionButton store={store} />
                <InsertSectionButton store={store} />

                {editorState.popupActive === "AddSection" && (
                    <AddSectionMenu store={store} />
                )}
                {editorState.popupActive === "InsertSection" && (
                    <InsertSectionMenu store={store}/>
                )}
            </div>
        </ZoomableScrollContainer>
    );
}
