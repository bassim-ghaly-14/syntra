import { renderSidebar } from "../components/sidebar.js";
import { renderNavbar } from "../components/navbar.js";

import {
    initializeCommandPalette
} from "../components/commandPalette.js";

import {
    initializeDashboard
} from "../dashboard/dashboard.js";

import {
    loadLayout
} from "../dashboard/layoutManager.js";

import {
    startRealtimeEngine
} from "../services/realtimeEngine.js";

import {
    pushNotification
} from "../services/notificationService.js";

import {
    showErrorModal
} from "../components/modal.js";

import {
    initializeDropdowns
} from "../components/dropdown.js";

let appInitialized = false;
let globalEventsRegistered = false;

function validateRootElements() {
    const requiredElements = [
        "sidebar",
        "navbar",
        "dashboard-grid"
    ];

    const missingElements =
        requiredElements.filter(id => {
            return !document.getElementById(id);
        });

    if (missingElements.length) {
        throw new Error(
            `Missing required elements: ${missingElements.join(", ")}`
        );
    }
}

function registerGlobalEvents() {
    if (globalEventsRegistered) {
        return;
    }

    globalEventsRegistered = true;

    window.addEventListener(
        "error",
        event => {
            console.error(event.error);

            showErrorModal(
                "An unexpected application error occurred."
            );
        }
    );

    window.addEventListener(
        "unhandledrejection",
        event => {
            console.error(event.reason);

            showErrorModal(
                "A background process failed unexpectedly."
            );
        }
    );
}

function applySavedTheme() {
    const theme =
        localStorage.getItem(
            "syntra-theme"
        ) || "dark";

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );
}

async function initializeSystems() {
    await renderSidebar();

    await renderNavbar();

    initializeDashboard();

    loadLayout();

    initializeDropdowns();

    initializeCommandPalette();

    startRealtimeEngine();
}

async function initializeApplication() {
    if (appInitialized) {
        return;
    }

    appInitialized = true;

    try {
        validateRootElements();

        applySavedTheme();

        registerGlobalEvents();

        await initializeSystems();

        pushNotification(
            "SYNTRA initialized successfully",
            "success"
        );
    } catch (error) {
        console.error(error);

        showErrorModal(
            error?.message ||
                "Application initialization failed."
        );
    }
}

export function initializeApp() {
    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializeApplication,
            { once: true }
        );

        return;
    }

    initializeApplication();
}