import "./songEditor.css";
import {SongView} from "./views/SongView.jsx"
import {SectionView} from "./views/SectionView.jsx";
import {useState, useEffect} from "react";

export function SongEditor({ store }) {

  const [viewButtons, setViewButtons] = useState({
    song: false,
    section: false,
    sequence: false
  });

  const [songVersion, setSongVersion] = useState(store.state.project.songVersion);
  const [editorState, setEditorState] = useState(store.state.editor);

  useEffect(() => {
    function handleMouseUp() {
      const editor = store.state.editor;

      if (editor.drag.active) {
        store.actions.commitSectionDrag();
      }
      if (editor.sequenceDrag.active) {
        store.actions.commitSequenceDrag();
      }
    }

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);


  useEffect(() => {
    function handleClickOff(e) {

      // If click is inside a popup → ignore
      if (e.target.closest(".popup-container")) return;

      // If click is on a section block → ignore
      if (e.target.closest(".section-block")) return;

      // If click is on a sequence block → ignore
      if (e.target.closest(".sequence-block")) return;

      // If click is on a view button → ignore
      if (e.target.closest(".view-button-container")) return;

      // Otherwise → clear selection
      store.actions.clearAllSelections();
      console.log("yoyo")
    }

    document.addEventListener("mousedown", handleClickOff);
    return () => document.removeEventListener("mousedown", handleClickOff);
  }, []);
  // Mouse UI logic (unchanged)
  useEffect(() => {
    function handleMouseMove(e) {
      const action = e.target.dataset.action;
      if (Object.keys(viewButtons).includes(action)) {
        setViewButtons(Object.fromEntries(
          Object.keys(viewButtons).map(key => [key, key === action])
        ));
      } else {
        setViewButtons(Object.fromEntries(
          Object.keys(viewButtons).map(key => [key, false])
        ));
      }
    }

    function handleMouseDown(e) {
      const action = e.target.dataset.action;
      if (Object.keys(viewButtons).includes(action)) {
        store.actions.setActiveEditor(action);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  });

  // Subscribe to store
  useEffect(() => {
    const unsub = store.subscribe(() => {
      // Always pull fresh editor state
      setEditorState({ ...store.state.editor });

      // Only update songVersion when it actually changes
      setSongVersion(store.state.project.songVersion);
    });
    return unsub;
  }, []);

  // When songVersion changes, rebuild songSpace and sync editorState
  useEffect(() => {
    store.actions.updateSongSpaceFromState();
    setEditorState({...store.state.editor}); // ensure React sees new songSpace
  }, [songVersion]);

  const songSpace = editorState.songSpace;

  function getViewButtonWidth(view){
    if(editorState.activeEditor === view) return "60px";
    else if(viewButtons[view]) return "40px";
    else return "20px";
  }


  return (
    <div className="outer-container">

      <div className="view-buttons">
        <div className="view-button-container"
            style={{ width: getViewButtonWidth("song") }}
            data-action="song" />
        <div className="view-button-container"
            style={{ width: getViewButtonWidth("section") }}
            data-action="section" />
      </div>

      <div className="scroll-wrapper">
        <div className="inner-container">
          {editorState.activeEditor === "song" && (
            <SongView store={store} editorState={editorState} songSpace={songSpace} />
          )}
          {editorState.activeEditor === "section" && (
            <SectionView store={store} editorState={editorState} songSpace={songSpace} />
          )}
        </div>
      </div>
    </div>
  );
}
