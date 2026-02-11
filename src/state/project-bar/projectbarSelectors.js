
export const selectProjectName = (state) => state.projectBar.projectName;
export const selectIsSaved = (state) => state.projectBar.isSaved;

// Transport
export const selectIsPlaying = (state) => state.projectBar.isPlaying;
export const selectPlayheadPosition = (state) => state.projectBar.playheadPosition;

// Undo / Redo
export const selectCanUndo = (state) => state.projectBar.canUndo;
export const selectCanRedo = (state) => state.projectBar.canRedo;
// Menus
export const selectActiveMenu = (state) => state.projectBar.activeMenu;
export const selectMenuOpen = (state) => state.projectBar.menuOpen;
export const selectSongMenuOpen = (state) => state.projectBar.open;