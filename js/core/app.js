import { renderSidebar } from "../components/sidebar.js";
import { renderNavbar } from "../components/navbar.js";
import { initializeCommandPalette } from "../components/commandPalette.js";
import { initializeDashboard } from "../dashboard/dashboard.js";
import { loadLayout } from "../dashboard/layoutManager.js";
import { startRealtimeEngine } from "../services/realtimeEngine.js";
import { pushNotification } from "../services/notificationService.js";
import { showErrorModal } from "../components/modal.js";
import { initializeDropdowns } from "../components/dropdown.js";
import { setTheme } from "./state.js";
import { globalLifecycleManager } from "../utils/lifecycle.js";

let appInitialized = false;
let globalEventsRegistered = false;

function validateRootElements() {
    const requiredElements = ["sidebar", "navbar", "dashboard-grid"];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length) {
        throw new Error(`Missing required elements: ${missingElements.join(", ")}`);
    }
}

function registerGlobalEvents() {
    if (globalEventsRegistered) return;
    globalEventsRegistered = true;

    const handleError = (event) => {
        console.error("Application error:", event.error || event.reason);
        showErrorModal("An unexpected application error occurred. Please refresh the page if the issue persists.");
    };

    const handleUnhandledRejection = (event) => {
        console.error("Unhandled promise rejection:", event.reason);
        showErrorModal("A background process failed unexpectedly. Some features may be unavailable.");
    };

    globalLifecycleManager.addEventListener(window, "error", handleError);
    globalLifecycleManager.addEventListener(window, "unhandledrejection", handleUnhandledRejection);

    // Cleanup on page unload
    globalLifecycleManager.addEventListener(window, "beforeunload", () => {
        globalLifecycleManager.deactivate();
    });

    // Pause realtime engine when tab is hidden
    globalLifecycleManager.addEventListener(document, "visibilitychange", () => {
        if (document.hidden) {
            const { stopRealtimeEngine } = require("../services/realtimeEngine.js");
            stopRealtimeEngine();
        } else {
            const { startRealtimeEngine } = require("../services/realtimeEngine.js");
            startRealtimeEngine();
        }
    });
}

function applySavedTheme() {
    const theme = localStorage.getItem("syntra-theme") || "dark";
    
    // Validate theme
    const validThemes = ["dark", "light"];
    const safeTheme = validThemes.includes(theme) ? theme : "dark";
    
    document.documentElement.setAttribute("data-theme", safeTheme);
    setTheme(safeTheme);
}

async function initializeSystems() {
    try {
        await renderSidebar();
        await renderNavbar();
        initializeDropdowns();
        initializeCommandPalette();
        startRealtimeEngine();
    } catch (error) {
        console.error("System initialization error:", error);
        showErrorModal("Failed to initialize application systems. Some features may be unavailable.");
    }
}

async function initializeApplication() {
    if (appInitialized) return;
    appInitialized = true;

    try {
        validateRootElements();
        applySavedTheme();
        registerGlobalEvents();
        globalLifecycleManager.activate();
        
        await initializeSystems();

        const currentPage = window.location.hash.slice(1) || "dashboard";
        if (currentPage === "dashboard") {
            initializeDashboard();
            loadLayout();
        }

        pushNotification("SYNTRA initialized successfully", "success");
    } catch (error) {
        console.error("Application initialization failed:", error);
        showErrorModal(error?.message || "Application initialization failed. Please refresh the page.");
    }
}

export function initializeApp() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeApplication, { once: true });
        return;
    }
    initializeApplication();
}
