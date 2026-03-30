import { initialState } from "../../state/store/initialState";
import * as helpers from "./appHelpers.js"
import * as fileSystem from "../../data/file/fileSystem";

//Extracts only project specific areas of the state
export function serializeProject(state) {
  return {
    version: 1,
    project: state.project.currentProject,
    sections: state.sections,
    sequences: state.sequences,
    chords: state.chords,
  };
}

//injects project specific areas back into state from a json string
export function deserializeProject(jsonString){
    let data;
    //parse JSON string safely
    try {
        data = JSON.parse(jsonString);
    } catch(e) {
        window.electronAPI.showError("Invalid Project File", e.message)
        throw new Error("Invalid JSON: " + e.messaage);
    }

    //Validate Data
    const errors = validateProjectData(data);
    if(errors.length > 0){
        window.electronAPI.showError("Invalid Project File", "Project file cannot be loaded due to errors: \n" + errors.join("\n"))
        throw new Error("Project file failed validdation\n" + errors.join("\n"));
    }

    //reconstruct state
    const newState = structuredClone(initialState);

    newState.project.currentProject = data.project;
    newState.sections = data.sections;
    newState.sequences = data.sequences;
    newState.chords = data.chords;

    return newState;
}

//Saves the project in a new file
export async function saveProjectAs(folder, state){
    state.project.currentProject.filePath = folder + "\\" + state.project.currentProject.name + ".cecep";
    const data = serializeProject(state);
    await fileSystem.saveProjectToFile(data);
}

//Saves the project at the listed file path
export async function saveExistingProject(state) {
  const path = state.project.currentProject.filePath;

  //Checks if the listed file path exists
  if (!path) {
    window.electronAPI.showError("Project Has No File Path", "try using Save As instead as there is no file path for this project yet")
    throw new Error("Project has no file path. Use Save As… instead.");
  }

  //gets data a validates it
  const data = serializeProject(state);
  const errors = validateProjectData(data);

  if (errors.length > 0) {
    window.electronAPI.showError("Cannot Save Project", "Cannot Save Project due to errors: \n" + + errors.join("\n"))

    throw new Error("Cannot save project: " + errors.join("\n"));
  }

  //calls Data layer to save file
  await fileSystem.saveProjectToFile(data);
}

//Loads a project file and injects project specific areas into the state.
export async function loadProject(state, filePath){
    const jsonString = await fileSystem.loadProjectFromFile(filePath)
    const newState = deserializeProject(jsonString)

    //apply any needed changes to name and file path (in the case of the file name being changed)
    newState.project.currentProject.name = helpers.getProjectNameFromFilePath(filePath);
    newState.project.currentProject.filePath = filePath;

    return newState;
}

export async function renameProject(filePath, newFilePath){
    fileSystem.renameProject(filePath, newFilePath);
}



export function validateProjectData(data) {
    let errors = [];

    //Top Level Checks
    if(typeof data !== "object" || data === null) {
        errors.push("Project file is not an object");
        return errors;
    }

    //validate version field
    if(typeof data.version !== "number") {
        errors.push("Missing or invalid 'version' field")

    }
    //validate project field
    if(typeof data.project !== "object" || data.project === null){
        errors.push("Missing or invalid 'project' field")
    }
    //validate sections field
    if(typeof data.sections !== "object" || data.sections === null){
        errors.push("Missing or invalid 'sections' field")
    }
    //validate sequences field
    if(typeof data.sequences !== "object" || data.sequences === null){
        errors.push("Missing or invalid 'sequences' field")
    }
    //validate chords field
    if(typeof data.chords !== "object" || data.chords === null){
        errors.push("Missing or invalid 'chords' field")
    }
    errors = validateIDMap("sections", data.sections, errors);
    errors = validateIDMap("sequences", data.sequences, errors);
    errors = validateIDMap("chords", data.chords, errors);

    return errors;

}

function validateIDMap(name, map, errors){
    if(typeof map.byID !== "object" || map.byID === null){
        errors.push(`${name}.byID missing or invalid`)
        return errors;
    }
    if(typeof map.allIDs !== "object" || map.allIDs === null){
        errors.push(`${name}.allIDs missing or invalid`)
        return errors;
    }
    // Check allIDs matches byID keys
    for (const id of map.allIDs) {
        if (!map.byID[id]) {
        errors.push(`'${name}.allIDs' contains ID '${id}' not found in byID`);
        }
    }

    // Check each object has an id field
    for (const [id, obj] of Object.entries(map.byID)) {
        if (!obj.id) {
        errors.push(`Object '${name}.byID.${id}' missing 'id' field`);
        }
    }

    return errors;
}