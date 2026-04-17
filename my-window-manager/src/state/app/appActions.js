// src/state/app/appActions.js

// Lifecycle
export const setAppReady = (value) => (state) => {
  state.app.isReady = value;
}

export const setAppLoading = (value, message = null) => (state) => {
  state.app.isLoading = value;
  state.app.loadingMessage = message;
}

// Theme + appearance
export const setTheme = (theme) => (state) => {
  state.app.theme = theme;
}

export const setAccentColor = (color) => (state) => {
  state.app.accentColor = color;
}

// Modals
export const showModal = (modalName, props = null) => (state) => {
  state.app.activeModal = modalName;
  state.app.modalProps = props;
}

export const hideModal = () => (state) => {
  state.app.activeModal = null;
  state.app.modalProps = null;
}

// Notifications
export const pushNotification = (notification) => (state) => {
  state.app.notifications.push({
    id: crypto.randomUUID(),
    ...notification
  });
}

export const removeNotification = (id) => (state) => {
  state.app.notifications = state.app.notifications.filter(n => n.id !== id);
}

// Errors
export const setGlobalError = (error) => (state) => {
  state.app.globalError = error;
}

export const clearGlobalError = () => (state) => {
  state.app.globalError = null;
}

// Layout mode
export const setLayoutMode = (mode) => (state) => {
  state.app.layoutMode = mode;
}

// Command palette
export const openCommandPalette = () => (state) => {
  state.app.isCommandPaletteOpen = true;
}

export const closeCommandPalette = () => (state) => {
  state.app.isCommandPaletteOpen = false;
}

export const setLastKeyPressed = (key) => (state) => {
  state.app.lastKeyPressed = key;
}

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

