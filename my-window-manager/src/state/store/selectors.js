import * as appSelectors from "../app/appSelectors.js"
import * as sidebarSelectors from "../sidebar/sidebarSelectors.js"
import * as windowSelectors from "../windows/windowSelectors.js"
import * as projectBarSelectors from "../project-bar/projectbarSelectors.js"
import * as editorNavSelectors from "../editor/editorSelectors.js"
import * as sequenceSelectors from "../sequences/sequenceSelectors.js"
import * as chordSelectors from "../chords/chordSelectors.js"
import * as sectionSelectors from "../sections/sectionSelectors.js"

export const selectors = {
  app: appSelectors,
  sidebar: sidebarSelectors,
  windows: windowSelectors,
  projectBar: projectBarSelectors,
  editor: editorNavSelectors,
  sequences: sequenceSelectors,
  chords: chordSelectors,
  sections: sectionSelectors
}
