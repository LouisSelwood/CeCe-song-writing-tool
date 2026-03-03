export const appInitialState = {
    // App lifecycle
    isReady: null,          // app finished booting
    isLoading: null,        // global loading indicator
    loadingMessage: null,    // optional text for loading screens
    version: 0,

    // Theme + appearance
    theme: null,          // "light", "dark", "system"
    accentColor: null,     // or null for default

    // Global modals
    activeModal: null,       // "settings", "about", "export", etc.
    modalProps: null,        // data passed to the modal

    // Global notifications / toasts
    notifications: null,       // array of { id, type, message }

    // Error handling
    globalError: null,       // fatal or top-level error message

    // App layout mode
    layoutMode: null,   // "default", "focus", "performance"

    // Keyboard + input state
    isCommandPaletteOpen: null,
    lastKeyPressed: null,

    // App version + metadata
    version: null,
    environment: null, // or "production"
}