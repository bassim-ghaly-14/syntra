import { pushNotification } from "../services/notificationService.js";
import { getNotifications } from "../services/notificationService.js";
import { openModal } from "./modal.js";
import { setTheme } from "../core/state.js";

async function loadSvgInline(filename, size = 20) {
    try {
        const response = await fetch(`./assets/icons/${filename}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${filename}`);
        }

        const svgText = await response.text();

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(
            svgText,
            "image/svg+xml"
        );

        const svg = svgDoc.documentElement;

        svg.setAttribute("width", size);
        svg.setAttribute("height", size);
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("stroke", "currentColor");

        return svg.outerHTML;
    } catch (error) {
        console.error(
            `Failed to load SVG: ${filename}`,
            error
        );

        return `
            <svg viewBox="0 0 24 24"
                 width="${size}"
                 height="${size}">
                <circle
                    cx="12"
                    cy="12"
                    r="3"
                    fill="currentColor"
                />
            </svg>
        `;
    }
}

async function createNavbarMarkup() {
    const searchIcon =
        await loadSvgInline("search.svg", 18);

    const sunIcon =
        await loadSvgInline("sun.svg", 20);

    const moonIcon =
        await loadSvgInline("moon.svg", 20);

    const bellIcon =
        await loadSvgInline("bell.svg", 20);

    const commandIcon =
        await loadSvgInline("command.svg", 18);

    return `
        <div class="navbar-shell">

            <div class="navbar-left">
                <button
                    class="navbar-action-btn"
                    id="command-palette-trigger"
                    type="button"
                >
                    <span class="navbar-action-icon">
                        ${commandIcon}
                    </span>

                    <span>
                        Command Palette
                    </span>

                    <kbd>
                        Ctrl + K
                    </kbd>
                </button>
            </div>

            <div class="navbar-center">
                <div class="navbar-search">
                    <span class="search-icon">
                        ${searchIcon}
                    </span>

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
                    <span class="navbar-icon theme-icon-sun">
                        ${sunIcon}
                    </span>

                    <span class="navbar-icon theme-icon-moon">
                        ${moonIcon}
                    </span>
                </button>

                <button
                    class="navbar-icon-btn"
                    id="notifications-btn"
                    type="button"
                    aria-label="Notifications"
                >
                    <span class="navbar-icon">
                        ${bellIcon}
                    </span>

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
                        src="./assets/images/avatars/avatar-1.png"
                        alt="Profile Avatar"
                    >

                    <div>
                        <strong>
                            Admin User
                        </strong>

                        <span>
                            Administrator
                        </span>
                    </div>
                </button>

            </div>

        </div>
    `;
}

function updateNotificationBadge() {
    const badge =
        document.getElementById(
            "notification-badge"
        );

    if (!badge) {
        return;
    }

    badge.textContent =
        String(
            getNotifications().length
        );
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

    setTheme(savedTheme);

    updateThemeIcon(savedTheme);

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

            setTheme(nextTheme);

            updateThemeIcon(
                nextTheme
            );

            pushNotification(
                `Theme changed to ${nextTheme}`,
                "success"
            );

            updateNotificationBadge();
        }
    );
}

function updateThemeIcon(theme) {
    const sunIcon =
        document.querySelector(
            ".theme-icon-sun"
        );

    const moonIcon =
        document.querySelector(
            ".theme-icon-moon"
        );

    if (
        !sunIcon ||
        !moonIcon
    ) {
        return;
    }

    if (theme === "dark") {
        sunIcon.style.display =
            "none";

        moonIcon.style.display =
            "flex";
    } else {
        sunIcon.style.display =
            "flex";

        moonIcon.style.display =
            "none";
    }
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
            const notifications =
                getNotifications();

            const content =
                notifications.length
                    ? notifications
                        .slice()
                        .reverse()
                        .map(
                            item => `
                                <div class="notification-item">
                                    ${item.message}
                                </div>
                            `
                        )
                        .join("")
                    : `
                        <div class="notification-item">
                            No notifications available.
                        </div>
                    `;

            openModal({
                title:
                    "Notifications",

                content: `
                    <div class="notification-list">
                        ${content}
                    </div>
                `,

                confirmText:
                    "Close"
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

                confirmText:
                    "Close"
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

    let debounceTimer;

    searchInput.addEventListener(
        "input",
        event => {
            clearTimeout(
                debounceTimer
            );

            debounceTimer =
                setTimeout(
                    () => {
                        const value =
                            event.target.value
                                .trim()
                                .toLowerCase();

                        const widgets =
                            document.querySelectorAll(
                                ".widget"
                            );

                        widgets.forEach(
                            widget => {
                                const text =
                                    widget.textContent.toLowerCase();

                                widget.style.display =
                                    text.includes(
                                        value
                                    )
                                        ? ""
                                        : "none";
                            }
                        );
                    },
                    150
                );
        }
    );
}

export async function renderNavbar() {
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
        await createNavbarMarkup();

    initializeThemeSystem();

    initializeNotificationPanel();

    initializeProfileButton();

    initializeSearch();

    updateNotificationBadge();
}