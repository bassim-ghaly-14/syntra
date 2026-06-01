const listeners = new Set();

export const appState = {
    theme: "dark",
    widgets: [],
    metrics: [],
    notifications: []
};

function notifyListeners() {
    listeners.forEach(callback => {
        try {
            callback(appState);
        } catch (error) {
            console.error("State listener error:", error);
        }
    });
}

export function getState() {
    return appState;
}

export function setTheme(theme) {
    const validThemes = ["dark", "light"];
    
    if (!validThemes.includes(theme)) {
        console.warn(`Invalid theme: ${theme}. Falling back to dark.`);
        theme = "dark";
    }

    appState.theme = theme;
    notifyListeners();
}

export function subscribe(callback) {
    if (typeof callback !== "function") {
        throw new Error("Subscribe callback must be a function");
    }

    listeners.add(callback);

    return () => {
        listeners.delete(callback);
    };
}