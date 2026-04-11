import "../SongEditor.css";
import {Bars} from "../../shared-components/Bars.jsx"
import buildSequences from "../../../components/buildSequences.jsx";
import buildSectionTags from "../../../components/buildSectionTags.jsx";
import { ZoomableScrollContainer } from "../../shared-components/ZoomableScrollableContainer.jsx";
import { AddSectionButton } from "../../shared-components/Buttons/AddSection.jsx";
import { InsertSectionButton } from "../../shared-components/Buttons/InsertSection.jsx";
import { AddSequenceMenu } from "../popups/AddSequenceMenu.jsx";
import { InsertSequenceMenu } from "../popups/InsertSequenceMenu.jsx";
import { EditingMenu } from "../popups/SequenceEditingMenu.jsx";

export function SectionView({ store, editorState, songSpace }) {

    const baseWidth = store.selectors.editor.selectBaseWidth(store.state);
    const totalWidth = baseWidth * editorState.zoomLevel;

    // ⬅️ songSpace now passed directly
    const sequences = buildSequences(store, songSpace);
    const sectionTags = buildSectionTags(store, songSpace);

    return (
        <ZoomableScrollContainer store={store} contentWidth={totalWidth} baseWidth={baseWidth}>
            <Bars state={store.state}/>
            {sectionTags}
            <div className="sequence-holder">
                <EditingMenu store={store} />
                {sequences}
                <AddSectionButton store={store} />
                <InsertSectionButton store={store} />

                {editorState.popupActive === "AddSequence" && <AddSequenceMenu store={store} />}
                {editorState.popupActive === "InsertSequence" && <InsertSequenceMenu store={store}/>}
            </div>
        </ZoomableScrollContainer>
    );
}
