import {windowsDomain} from "./windows/windowIndex.js";
import {chordsDomain} from "./chords/chordIndex.js";
import {sequencesDomain} from "./sequences/sequenceIndex.js";
import {sectionsDomain} from "./sections/sectionIndex.js";
import {projectDomain} from "./project/projectIndex.js";
import {appDomain} from "./app/appIndex.js";
import { modelDomain } from "./model/modelIndex.js";

export const domain = {
    windows: windowsDomain,
    chords: chordsDomain,
    sequences: sequencesDomain,
    sections: sectionsDomain,
    project: projectDomain,
    app: appDomain,
    model: modelDomain,
}