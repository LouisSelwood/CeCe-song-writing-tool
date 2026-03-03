import * as appActions from "../app/appActions.js"
import * as sidebarActions from "../sidebar/sidebarActions.js"
import * as windowActions from "../windows/windowActions.js"
import * as projectBarActions from "../project-bar/projectbarActions.js"
import * as editorNavActions from "../editor/editorActions.js"
import * as sequenceActions from "../sequences/sequenceActions.js"
import * as chordActions from "../chords/chordActions.js"
import * as historyActions from "../history/historyActions.js"
import * as sectionActions from "../sections/sectionActions.js"
import * as projectActions from "../project/projectActions.js"

export const actions = {
  ...appActions,
  ...sidebarActions,
  ...windowActions,
  ...projectBarActions,
  ...editorNavActions,
  ...sequenceActions,
  ...sectionActions,
  ...chordActions,
  ...historyActions,
  ...projectActions
}
