import {
    pushNotification
} from "../services/notificationService.js";

import {
    openModal
} from "./modal.js";

function createNavbarMarkup() {
    return `
        <div class="navbar-shell">

            <div class="navbar-left">

                <button
                    class="navbar-action-btn"
                    id="command-palette-trigger"
                    type="button"
                >
                    <span class="navbar-action-icon"></span>

                    <span>
                        Command Palette
                    </span>

                    <kbd>Ctrl + K</kbd>
                </button>

            </div>

            <div class="navbar-center">

                <div class="navbar-search">

                    <input
                        id="global-search"
                        type="text"
                        placeholder="Search dashboards, widgets, reports..."
                        autocomplete="off"
                    >

                </div>

            </div>

            <div class="navbar-right">

                <button
                    class="navbar-icon-btn"
                    id="theme-toggle-btn"
                    type="button"
                    aria-label="Theme Toggle"
                >
                    <span class="navbar-icon"></span>
                </button>

                <button
                    class="navbar-icon-btn"
                    id="notifications-btn"
                    type="button"
                    aria-label="Notifications"
                >
                    <span class="navbar-icon"></span>

                    <span
                        id="notification-badge"
                        class="notification-badge"
                    >
                        0
                    </span>
                </button>

                <button
                    class="navbar-profile-btn"
                    id="profile-btn"
                    type="button"
                >
                    <img
                        src=""
                        alt="Profile Avatar"
                    >

                    <div>
                        <strong>Admin User</strong>
                        <span>Administrator</span>
                    </div>
                </button>

            </div>

        </div>
    `;
}

function initializeThemeSystem() {
    const button =
        document.getElementById(
            "theme-toggle-btn"
        );

    if (!button) {
        return;
    }

    const savedTheme =
        localStorage.getItem(
            "syntra-theme"
        ) || "dark";

    document.documentElement.setAttribute(
        "data-theme",
        savedTheme
    );

    button.addEventListener(
        "click",
        () => {
            const currentTheme =
                document.documentElement.getAttribute(
                    "data-theme"
                ) || "dark";

            const nextTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";

            document.documentElement.setAttribute(
                "data-theme",
                nextTheme
            );

            localStorage.setItem(
                "syntra-theme",
                nextTheme
            );

            pushNotification(
                `Theme changed to ${nextTheme}`,
                "success"
            );
        }
    );
}

function initializeNotificationPanel() {
    const button =
        document.getElementById(
            "notifications-btn"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {
            openModal({
                title: "Notifications",

                content: `
                    <div class="notification-list">

                        <div class="notification-item">
                            Dashboard initialized successfully.
                        </div>

                        <div class="notification-item">
                            Realtime engine active.
                        </div>

                        <div class="notification-item">
                            Layout persistence enabled.
                        </div>

                    </div>
                `,

                confirmText: "Close"
            });
        }
    );
}

function initializeProfileButton() {
    const button =
        document.getElementById(
            "profile-btn"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        () => {
            openModal({
                title: "Profile",

                content: `
                    <div class="profile-modal">

                        <h3>
                            Admin User
                        </h3>

                        <p>
                            Dashboard Administrator
                        </p>

                    </div>
                `,

                confirmText: "Close"
            });
        }
    );
}

function initializeSearch() {
    const searchInput =
        document.getElementById(
            "global-search"
        );

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener(
        "input",
        event => {
            const value =
                event.target.value
                    .trim()
                    .toLowerCase();

            const widgets =
                document.querySelectorAll(
                    ".widget"
                );

            widgets.forEach(widget => {
                const text =
                    widget.textContent.toLowerCase();

                widget.style.display =
                    text.includes(value)
                        ? ""
                        : "none";
            });
        }
    );
}

export function renderNavbar() {
    const navbar =
        document.getElementById(
            "navbar"
        );

    if (!navbar) {
        return;
    }

    navbar.className =
        "navbar";

    navbar.innerHTML =
        createNavbarMarkup();

    initializeThemeSystem();

    initializeNotificationPanel();

    initializeProfileButton();

    initializeSearch();
}