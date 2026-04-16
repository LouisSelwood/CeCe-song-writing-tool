import "../SongEditor.css";
import { useState, useEffect } from "react";
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
    const playheadBeat = store.state.editor.playheadPosition
    const x = store.selectors.editor.beatToX(playheadBeat, store.state);
    function onTimelineClick(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const screenX = e.clientX - rect.left;


        const beat = store.selectors.editor.snapBeatToNearestBar(
            store.selectors.editor.xToBeat(screenX, store.state),
            store.state
        );

        store.actions.setPlayerPosition(beat);
    }

    
    useEffect(() => {
        const drag = store.state.editor.drag;
        if (!drag.active) return;
    
        const { x, y } = store.state.windows.mousePos;
        store.actions.updateSectionDrag(x, y);
    }, [store.state.windows.mousePos.x, store.state.windows.mousePos.y]);
    return (
        <ZoomableScrollContainer 
            store={store} 
            contentWidth={totalWidth} 
            baseWidth={baseWidth}
            >
            <div className="timeline-content" onClick={(onTimelineClick)}>
                <Bars state={store.state}/>
                <div className="playhead" style={{left: x}} />
                <div className="section-holder">
                    <EditingMenu store={store} />
                    {sections}
                    <AddSectionButton store={store} />
                    <InsertSectionButton store={store} />

                    {editorState.popupActive === "AddSection" && <AddSectionMenu store={store} />}
                    {editorState.popupActive === "InsertSection" && <InsertSectionMenu store={store}/>}
                </div>
            </div>
        </ZoomableScrollContainer>
    );
}
