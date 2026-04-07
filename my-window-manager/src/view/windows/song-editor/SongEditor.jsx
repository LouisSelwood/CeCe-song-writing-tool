import "./songEditor.css";
import {SongView} from "./views/SongView.jsx"
import {SectionView} from "./views/SectionView.jsx";
import {SequenceView} from "./views/SequenceView.jsx";
import {useState, useEffect} from "react";
export function SongEditor({ store }) {
  //contains hover state of view buttons
  const [viewButtons, setViewButtons] = useState({"song": false, "section": false, "sequence": false})
  const [songVersion, setSongVersion] = useState(store.state.project.songVersion);
  const [editorState, setEditorState] = useState(store.state.editor);


  //handles mouse events for overall song editor ui
  useEffect(() => {
    //triggers on mouse move
    function handleMouseMove(e) {
      const action = e.target.dataset.action;
      //checks if mouse is over a view button
      if(Object.keys(viewButtons).includes(action)){
        //sets all viewButtons hover state to false exept from current one
        setViewButtons(
          Object.fromEntries(
            Object.keys(viewButtons).map(key => [key, key == action])
          )
        );
      }else{ 
        //resets view buttons if none are hovered over
        setViewButtons(
          Object.fromEntries(
            Object.keys(viewButtons).map(key => [key, false])
          )
        );
      }

    }

    //handles mouse click events
    function handleMouseDown(e) {
      const action = e.target.dataset.action;
      //switches active editor if view button clicked
      if(Object.keys(viewButtons).includes(action)){
        store.actions.setActiveEditor(action)
      }
    }
    //mouse listeners added
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      //mouse listeners removed
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
});

  //subscribes to store and updates state
  useEffect(() => {
    const unsub = store.subscribe(() => {
      setEditorState(store.state.editor);   // existing
      setSongVersion(store.state.project.songVersion); // new
    });
    return unsub;
  }, []);


  useEffect(() => {
    store.actions.updateSongSpaceFromState();
  }, [songVersion]);

  function getViewButtonWidth(view){
    if(editorState.activeEditor === view) return "60px";
    else if(viewButtons[view]) return "40px"
    else return "20px"
  }
  
  return (

    <div className="outer-container">

      {/*Global View Buttons*/}
      <div className="view-buttons">
        <div className="view-button-container"
            style={{ width: getViewButtonWidth("song") }}
            data-action="song" />
        <div className="view-button-container"
            style={{ width: getViewButtonWidth("section") }}
            data-action="section" />
      </div>

      {/*Scrollable Content*/}
      <div className="scroll-wrapper">
        <div className="inner-container">
          {editorState.activeEditor === "song" && <SongView store={store} />}
          {editorState.activeEditor === "section" && <SectionView store={store} />}
          {editorState.activeEditor === "sequence" && <SequenceView store={store} />}
        </div>
      </div>
    </div>
  );
}