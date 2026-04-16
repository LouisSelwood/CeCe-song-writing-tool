import "../SongEditor.css";
import { useState, useEffect } from "react";
import { Bars } from "../../shared-components/Bars.jsx";
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

    const sequences = buildSequences(store, songSpace);
    const sectionTags = buildSectionTags(store, songSpace);

    const playheadBeat = store.state.editor.playheadPosition;
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

      // DRAG UPDATE (global mousePos) ----------------------------------------
    useEffect(() => {
        const drag = store.state.editor.sequenceDrag;
        if (!drag.active) return;
    
        const { x, y } = store.state.windows.mousePos;
        store.actions.updateSequenceDrag(x, y);
    }, [store.state.windows.mousePos.x, store.state.windows.mousePos.y]);

    return (
        <ZoomableScrollContainer 
            store={store} 
            contentWidth={totalWidth} 
            baseWidth={baseWidth}
        >
            <div className="timeline-content" onClick={(onTimelineClick)}>
                <Bars state={store.state} />

                {/* ⭐ PLAYHEAD LINE */}
                <div className="playhead" style={{ left: x }} />

                {sectionTags}

                <div className="sequence-holder">
                    <EditingMenu store={store} />
                    {sequences}

                    <AddSectionButton store={store} />
                    <InsertSectionButton store={store} />

                    {editorState.popupActive === "AddSequence" && (
                        <AddSequenceMenu store={store} />
                    )}

                    {editorState.popupActive === "InsertSequence" && (
                        <InsertSequenceMenu store={store} />
                    )}
                </div>
            </div>
        </ZoomableScrollContainer>
    );
}
