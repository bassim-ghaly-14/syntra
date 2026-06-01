import { globalLifecycleManager } from "../utils/lifecycle.js";

const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "layout-dashboard.svg" },
    { id: "analytics", label: "Analytics", icon: "chart-column.svg" },
    { id: "reports", label: "Reports", icon: "file-text.svg" },
    { id: "activity", label: "Activity", icon: "activity.svg" },
    { id: "users", label: "Users", icon: "users.svg" },
    { id: "settings", label: "Settings", icon: "settings.svg" }
];

const svgCache = new Map();

async function loadSvgInline(filename) {
    if (svgCache.has(filename)) {
        return svgCache.get(filename);
    }

    try {
        const response = await fetch(`./assets/icons/${filename}`);
        const svgText = await response.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = svgDoc.documentElement;
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("fill", "transparent");
        svg.setAttribute("stroke", "currentColor");
        
        const svgHtml = svg.outerHTML;
        svgCache.set(filename, svgHtml);
        return svgHtml;
    } catch (error) {
        console.error(`Failed to load SVG: ${filename}`, error);
        const fallback = `<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="3" fill="transparent"/></svg>`;
        svgCache.set(filename, fallback);
        return fallback;
    }
}

function createNavigationItem(item, svgHtml) {
    return `
        <a href="#${item.id}" class="sidebar-nav-item" data-nav="${item.id}" role="menuitem" tabindex="0">
            <span class="sidebar-nav-icon">${svgHtml}</span>
            <span class="sidebar-nav-label">${item.label}</span>
        </a>
    `;
}

function attachNavigationEvents() {
    const items = document.querySelectorAll(".sidebar-nav-item");
    
    items.forEach(item => {
        const handleClick = (event) => {
            event.preventDefault();
            document.querySelectorAll(".sidebar-nav-item").forEach(link => {
                link.classList.remove("active");
            });
            item.classList.add("active");

            if (window.innerWidth < 1024) {
                closeMobileSidebar();
            }
        };

        const handleKeydown = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleClick(event);
            }
        };

        globalLifecycleManager.addEventListener(item, "click", handleClick);
        globalLifecycleManager.addEventListener(item, "keydown", handleKeydown);
    });
}

let sidebarOpen = false;

function openMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const toggleBtn = document.getElementById("mobile-menu-toggle");

    if (!sidebar) return;

    sidebarOpen = true;
    sidebar.classList.add("sidebar-open");
    if (overlay) overlay.classList.add("overlay-active");
    document.body.classList.add("no-scroll");
    if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "true");
        toggleBtn.classList.add("menu-open");
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const toggleBtn = document.getElementById("mobile-menu-toggle");

    if (!sidebar) return;

    sidebarOpen = false;
    sidebar.classList.remove("sidebar-open");
    if (overlay) overlay.classList.remove("overlay-active");
    document.body.classList.remove("no-scroll");
    if (toggleBtn) {
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.classList.remove("menu-open");
    }
}

function initializeMobileNav() {
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (!toggleBtn || !sidebar) {
        return;
    }

    const handleToggleClick = (event) => {
        event.preventDefault();
        if (sidebarOpen) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }
    };

    const handleOverlayClick = () => {
        closeMobileSidebar();
    };

    const handleResize = () => {
        if (window.innerWidth >= 1024) {
            closeMobileSidebar();
        }
    };

    globalLifecycleManager.addEventListener(toggleBtn, "click", handleToggleClick);
    
    if (overlay) {
        globalLifecycleManager.addEventListener(overlay, "click", handleOverlayClick);
    }

    globalLifecycleManager.addEventListener(window, "resize", handleResize);
}

export async function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    sidebar.className = "sidebar";
    sidebar.setAttribute("role", "navigation");
    sidebar.setAttribute("aria-label", "Main navigation");

    const itemsHtml = await Promise.all(
        navigationItems.map(async item => {
            const svg = await loadSvgInline(item.icon);
            return createNavigationItem(item, svg);
        })
    );

    sidebar.innerHTML = `
        <div class="sidebar-header">
            <div class="sidebar-brand">
                <div class="sidebar-brand-logo">
                    <img src="assets/logo/logo.PNG" alt="SYNTRA Logo" width="32" height="32">
                </div>
                <div class="sidebar-brand-content">
                    <h2>SYNTRA</h2>
                    <p>Analytics Platform</p>
                </div>
            </div>
        </div>
        <div class="sidebar-divider"></div>
        <nav class="sidebar-navigation" role="menu">
            ${itemsHtml.join("")}
        </nav>
        <div class="sidebar-footer">
            <div class="sidebar-user">
                <div class="sidebar-user-avatar">
                    <img src="./assets/images/avatars/avatar-1.png" alt="User Avatar" width="32" height="32">
                </div>
                <div class="sidebar-user-info">
                    <strong>Admin User</strong>
                    <span>System Owner</span>
                </div>
            </div>
        </div>
        <div id="sidebar-overlay" class="sidebar-overlay" aria-hidden="true"></div>
    `;

    const firstItem = sidebar.querySelector(".sidebar-nav-item");
    if (firstItem) firstItem.classList.add("active");

    attachNavigationEvents();
    initializeMobileNav();
}
