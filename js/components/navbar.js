import { pushNotification } from "../services/notificationService.js";
import { getNotifications } from "../services/notificationService.js";
import { openModal } from "./modal.js";
import { setTheme } from "../core/state.js";
import { validateSearchInput, createSafeElement } from "../utils/sanitizer.js";
import { globalLifecycleManager } from "../utils/lifecycle.js";

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
        svg.setAttribute("fill", "transparent");
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
                    fill="transparent"
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
                    aria-label="Open command palette"
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
                
                <button
                    class="navbar-action-btn mobile-menu-toggle"
                    id="mobile-menu-toggle"
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded="false"
                >
                    <span class="hamburger-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
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
                        aria-label="Search"
                    >
                </div>
            </div>

            <div class="navbar-right">

                <button
                    class="navbar-icon-btn"
                    id="theme-toggle-btn"
                    type="button"
                    aria-label="Toggle theme"
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
                        aria-live="polite"
                    >
                        0
                    </span>
                </button>

                <button
                    class="navbar-profile-btn"
                    id="profile-btn"
                    type="button"
                    aria-label="User profile"
                >
                    <img
                        src="./assets/images/avatars/avatar-1.png"
                        alt="Profile Avatar"
                        width="32"
                        height="32"
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

    const handleThemeToggle = () => {
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
    };

    globalLifecycleManager.addEventListener(button, "click", handleThemeToggle);
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

    const handleNotificationClick = () => {
        const notifications =
            getNotifications();

        let content = "";
        
        if (notifications.length) {
            const notificationItems = notifications
                .slice()
                .reverse()
                .map(item => {
                    // Escape notification message for safe display
                    const escapedMessage = document.createElement('div');
                    escapedMessage.textContent = item.message;
                    return `<div class="notification-item">${escapedMessage.innerHTML}</div>`;
                })
                .join("");
            content = `<div class="notification-list">${notificationItems}</div>`;
        } else {
            content = `<div class="notification-list"><div class="notification-item">No notifications available.</div></div>`;
        }

        openModal({
            title: "Notifications",
            content: content,
            confirmText: "Close"
        });
    };

    globalLifecycleManager.addEventListener(button, "click", handleNotificationClick);
}

function initializeProfileButton() {
    const button =
        document.getElementById(
            "profile-btn"
        );

    if (!button) {
        return;
    }

    const handleProfileClick = () => {
        openModal({
            title: "Profile",
            content: `Admin User - Dashboard Administrator`,
            confirmText: "Close"
        });
    };

    globalLifecycleManager.addEventListener(button, "click", handleProfileClick);
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

    const handleSearchInput = (event) => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            const value = validateSearchInput(event.target.value);

            const widgets =
                document.querySelectorAll(
                    ".widget"
                );

            widgets.forEach(widget => {
                const text =
                    widget.textContent.toLowerCase();

                widget.style.display =
                    text.includes(
                        value.toLowerCase()
                    )
                        ? ""
                        : "none";
            });
        }, 150);
    };

    globalLifecycleManager.addEventListener(searchInput, "input", handleSearchInput);
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
    
    navbar.setAttribute("role", "navigation");
    navbar.setAttribute("aria-label", "Top navigation");

    navbar.innerHTML =
        await createNavbarMarkup();

    initializeThemeSystem();

    initializeNotificationPanel();

    initializeProfileButton();

    initializeSearch();

    updateNotificationBadge();
}
