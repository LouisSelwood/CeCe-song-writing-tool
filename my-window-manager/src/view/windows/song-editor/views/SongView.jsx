import "../SongEditor.css";
import {Bars} from "../../shared-components/Bars.jsx"
import buildSections from "../../../components/buildSections.jsx"
import { ZoomableScrollContainer } from "../../shared-components/ZoomableScrollableContainer.jsx";
import { AddSectionButton } from "../../shared-components/Buttons/AddSection.jsx";
import { InsertSectionButton } from "../../shared-components/Buttons/InsertSection.jsx";
import { AddSectionMenu } from "../popups/AddSectionMenu.jsx";
import { InsertSectionMenu } from "../popups/InsertSectionMenu.jsx";
import { EditingMenu } from "../popups/SectionsEditingMenu.jsx";
export function SongView({ store, editorState, songSpace }) {
    const baseWidth = store.selectors.editor.selectBaseWidth(store.state);
    const totalWidth = baseWidth * editorState.zoomLevel;


    const sections = buildSections(store, songSpace);

    return (
        <ZoomableScrollContainer store={store} contentWidth={totalWidth} baseWidth={baseWidth}>
            <Bars state={store.state}/>
            <div className="section-holder">
                <EditingMenu store={store} />
                {sections}
                <AddSectionButton store={store} />
                <InsertSectionButton store={store} />

                {editorState.popupActive === "AddSection" && <AddSectionMenu store={store} />}
                {editorState.popupActive === "InsertSection" && <InsertSectionMenu store={store}/>}
            </div>
        </ZoomableScrollContainer>
    );
}
