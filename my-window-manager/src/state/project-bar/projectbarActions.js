export const setProjectName = (newProjectName) => (state, domain) => {
    //domain logic goes here
}
export const setIsSaved = (newValue) => (state) => {
    state.projectBar.isSaved = newValue;
}
export const setIsPlaying = (newValue) => (state, domain) => {
    //domain logic goes in here
}
export const setPlayerHeadPosition = (newPosition) => (state, domain) => {
    //domain logic goes in here
}
export const setCanRedo = (newValue) => (state) => {
    state.projectBar.canRedo = newValue;
}
export const setCanUndo = (newValue) => (state) => {
    state.projectBar.canUndo = newValue;
}

export const setActiveMenu = (menu) => (state) => {
    state.projectBar.activeMenu = menu;
}
export const setMenuOpen = (newValue) => (state) =>{
    state.projectBar.menuOpen = newValue;
}