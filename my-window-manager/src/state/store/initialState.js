import {appInitialState} from "../app/appState.js";
import {chordInitialState} from "../chords/chordState.js";
import {editorInitialState} from "../editor/editorState.js";
import {projectbarInitialState} from "../project-bar/projectbarState.js";
import {sectionInitialState} from "../sections/sectionState.js";
import {sequenceIntialState} from "../sequences/sequenceState.js";
import {sidebarInitialState} from "../sidebar/sidebarState.js";
import {windowInitialState} from "../windows/windowState.js"; 
import {historyInitialState} from "../history/historyState.js";

export const initialState = {
    app: appInitialState,
    chords: chordInitialState,
    editor: editorInitialState,
    projectBar: projectbarInitialState,
    sections: sectionInitialState,
    sequences: sequenceIntialState,
    sideBar: sidebarInitialState,
    windows: windowInitialState,
    history: historyInitialState,
}