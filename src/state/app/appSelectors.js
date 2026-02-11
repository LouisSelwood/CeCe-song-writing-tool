// src/state/app/appSelectors.js

// Lifecycle
export const selectAppReady = (state) => state.app.isReady;
export const selectAppLoading = (state) => state.app.isLoading;

export const selectAppLoadingMessage = (state) =>state.app.loadingMessage;
// Theme + appearance
export const selectTheme = (state) =>state.app.theme;
export const selectAccentColor = (state) =>state.app.accentColor;
// Modals
export const selectActiveModal = (state) =>state.app.activeModal;
export const selectModalProps = (state) =>state.app.modalProps;
// Notifications
export const selectNotifications = (state) =>state.app.notifications;
// Errors
export const selectGlobalError = (state) =>state.app.globalError;
// Layout mode
export const selectLayoutMode = (state) =>state.app.layoutMode;
// Command palette
export const selectCommandPaletteOpen = (state) =>state.app.isCommandPaletteOpen;

export const selectLastKeyPressed = (state) => state.app.lastKeyPressed;

// Metadata
export const selectAppVersion = (state) =>state.app.version;
export const selectEnvironment = (state) =>state.app.environment;
