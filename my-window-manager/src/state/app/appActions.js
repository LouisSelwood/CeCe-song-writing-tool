export const createNewProject = ({name}) => (state, domain) => {
  state.project.currentProject = domain.project.createProject(name);
}

export const setProjectName = ({ name }) => (state, domain, actions, setState) => {
  const currentProject = state.project.currentProject;
  const newFilePath = currentProject.filePath.replace(currentProject.name, name);

  const updatedProject = {
    ...currentProject,
    name,
    filePath: newFilePath
  };
  domain.app.renameProject(currentProject.filePath, newFilePath);
  setState({
    ...state,
    project: {
      ...state.project,
      currentProject: updatedProject
    }
  });

};


//Saves the project in a new file
export const saveProjectAs = (folder) => (state, domain) => {
  domain.app.saveProjectAs(folder, state);
}

//Saves the project to the current listed file
export const saveProject = () => (state, domain) => {
  domain.app.saveExistingProject(state);
}

//loads the project at the file path location
export const loadProject = (filePath) =>
  async (state, domain, actions, setState) => {
    const newState = await domain.app.loadProject(state, filePath);
    setState(newState)
    actions.updateSongSpaceFromState();
    //actions.setupProject();

};

export const setupProject = () => (state, domain, actions) => {
  actions.startChordWorkshop();
}

