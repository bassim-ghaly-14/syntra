import { initializeDashboard } from "../dashboard/dashboard.js";
import { loadLayout } from "../dashboard/layoutManager.js";

async function loadPage(pageId) {
    const grid = document.getElementById("dashboard-grid");
    if (!grid) return;

    try {
        if (pageId === "dashboard") {
            grid.innerHTML = "";
            initializeDashboard();
            loadLayout();
            return;
        }

        const response = await fetch(`./pages/${pageId}.html`);
        if (!response.ok) throw new Error("Page not found");
        const html = await response.text();
        grid.innerHTML = `<div class="page-content" data-page="${pageId}">${html}</div>`;
    } catch (error) {
        console.error(`Failed to load page: ${pageId}`, error);
        grid.innerHTML = `<div class="page-content error"><h2>404</h2><p>Page "${pageId}" not found</p></div>`;
    }
}

function updateActiveNav(activeId) {
    document.querySelectorAll(".sidebar-nav-item").forEach(link => {
        link.classList.toggle("active", link.dataset.nav === activeId);
    });
}

export async function navigateTo(pageId) {
    if (!pageId) pageId = "dashboard";
    window.location.hash = pageId;
    updateActiveNav(pageId);
    await loadPage(pageId);
}

export function initializeRouter() {
    window.addEventListener("hashchange", () => {
        const pageId = window.location.hash.slice(1) || "dashboard";
        navigateTo(pageId);
    });

    document.addEventListener("click", event => {
        const navItem = event.target.closest(".sidebar-nav-item");
        if (navItem) {
            event.preventDefault();
            const pageId = navItem.dataset.nav;
            navigateTo(pageId);
        }
    });

    const initialPage = window.location.hash.slice(1) || "dashboard";
    navigateTo(initialPage);
}