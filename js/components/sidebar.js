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
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("stroke", "currentColor");
        
        const svgHtml = svg.outerHTML;
        svgCache.set(filename, svgHtml);
        return svgHtml;
    } catch (error) {
        console.error(`Failed to load SVG: ${filename}`, error);
        const fallback = `<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`;
        svgCache.set(filename, fallback);
        return fallback;
    }
}

function createNavigationItem(item, svgHtml) {
    return `
        <a href="#" class="sidebar-nav-item" data-nav="${item.id}">
            <span class="sidebar-nav-icon">${svgHtml}</span>
            <span class="sidebar-nav-label">${item.label}</span>
        </a>
    `;
}

function attachNavigationEvents() {
    const items = document.querySelectorAll(".sidebar-nav-item");
    items.forEach(item => {
        item.addEventListener("click", event => {
            event.preventDefault();
            document.querySelectorAll(".sidebar-nav-item").forEach(link => {
                link.classList.remove("active");
            });
            item.classList.add("active");

            if (window.innerWidth < 1024) {
                closeMobileSidebar();
            }
        });
    });
}

function initializeMobileNav() {
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (!toggleBtn || !sidebar) {
        return;
    }

    function openMobileSidebar() {
        sidebar.classList.add("sidebar-open");
        if (overlay) overlay.classList.add("overlay-active");
        document.body.classList.add("no-scroll");
        toggleBtn.setAttribute("aria-expanded", "true");
    }

    function closeMobileSidebar() {
        sidebar.classList.remove("sidebar-open");
        if (overlay) overlay.classList.remove("overlay-active");
        document.body.classList.remove("no-scroll");
        toggleBtn.setAttribute("aria-expanded", "false");
    }

    toggleBtn.addEventListener("click", () => {
        if (sidebar.classList.contains("sidebar-open")) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }
    });

    if (overlay) {
        overlay.addEventListener("click", closeMobileSidebar);
    }

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024) {
            closeMobileSidebar();
        }
    });
}

export async function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    sidebar.className = "sidebar";

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
                    <img src="assets/logo/logo.PNG" alt="Syntra Logo">
                </div>
                <div class="sidebar-brand-content">
                    <h2>SYNTRA</h2>
                    <p>Analytics Platform</p>
                </div>
            </div>
        </div>
        <div class="sidebar-divider"></div>
        <nav class="sidebar-navigation">
            ${itemsHtml.join("")}
        </nav>
        <div class="sidebar-footer">
            <div class="sidebar-user">
                <div class="sidebar-user-avatar">
                    <img src="./assets/images/avatars/avatar-1.png" alt="User Avatar">
                </div>
                <div class="sidebar-user-info">
                    <strong>Admin User</strong>
                    <span>System Owner</span>
                </div>
            </div>
        </div>
    `;

    const firstItem = sidebar.querySelector(".sidebar-nav-item");
    if (firstItem) firstItem.classList.add("active");

    attachNavigationEvents();
    initializeMobileNav();
}