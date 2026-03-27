export function serializeProject(state) {
  return {
    version: 1,
    project: state.project,
    sections: state.sections,
    sequences: state.sequences,
    chords: state.chords,
  };
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