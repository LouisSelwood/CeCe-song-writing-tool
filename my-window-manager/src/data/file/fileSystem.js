//Saves a project file at a location
export async function saveProjectToFile(serializedProject){
    console.log(serializedProject)
    const path = serializedProject.project.filePath;
    const json = JSON.stringify(serializedProject, null, 2);
    const tempPath =  path + ".tmp";

    await window.api.writeFile(tempPath, json);
    await window.api.renameFile(tempPath, path);
}

//Loads a project file at a location
export async function loadProjectFromFile(filePath){
    const jsonString = await window.api.loadFile(filePath);
    console.log("Project Loaded")
    return jsonString;
}