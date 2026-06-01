import { initializeDashboard } from "../dashboard/dashboard.js";
import { loadLayout } from "../dashboard/layoutManager.js";
import { sanitizeHTML, validatePageId, createSafeElement } from "../utils/sanitizer.js";
import { globalLifecycleManager } from "../utils/lifecycle.js";

let currentPage = null;

async function loadPage(pageId) {
    const grid = document.getElementById("dashboard-grid");
    if (!grid) return;

    try {
        // Validate page ID
        if (!validatePageId(pageId)) {
            throw new Error(`Invalid page: ${pageId}`);
        }

        if (pageId === "dashboard") {
            grid.innerHTML = "";
            initializeDashboard();
            loadLayout();
            return;
        }

        // Create abort controller for this fetch
        const controller = globalLifecycleManager.createAbortController();
        
        const response = await fetch(`./pages/${pageId}.html`, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error("Page not found");
        }

        const html = await response.text();
        
        // SECURITY FIX: Sanitize fetched HTML content
        const sanitizedHtml = sanitizeHTML(html);
        
        // Create safe content container using textContent instead of innerHTML
        grid.innerHTML = "";
        const contentDiv = createSafeElement("div", "", "page-content");
        contentDiv.setAttribute("data-page", pageId);
        contentDiv.textContent = sanitizedHtml;
        grid.appendChild(contentDiv);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Page load aborted");
            return;
        }

        console.error(`Failed to load page: ${pageId}`, error);
        
        // SECURITY FIX: Use safe element creation instead of innerHTML
        grid.innerHTML = "";
        const errorDiv = createSafeElement("div", "", "page-content error");
        
        const heading = createSafeElement("h2", "404");
        const message = createSafeElement("p", `Page "${pageId}" not found`);
        
        errorDiv.appendChild(heading);
        errorDiv.appendChild(message);
        grid.appendChild(errorDiv);
    }
}

function updateActiveNav(activeId) {
    document.querySelectorAll(".sidebar-nav-item").forEach(link => {
        link.classList.toggle("active", link.dataset.nav === activeId);
    });
}

export async function navigateTo(pageId) {
    if (!pageId) pageId = "dashboard";
    
    // Validate page ID
    if (!validatePageId(pageId)) {
        console.warn(`Navigation attempted to invalid page: ${pageId}`);
        pageId = "dashboard";
    }

    currentPage = pageId;
    window.location.hash = pageId;
    updateActiveNav(pageId);
    await loadPage(pageId);
}

export function initializeRouter() {
    const handleHashChange = async () => {
        const pageId = window.location.hash.slice(1) || "dashboard";
        if (!validatePageId(pageId)) {
            window.location.hash = "dashboard";
            return;
        }
        await navigateTo(pageId);
    };

    const handleNavClick = (event) => {
        const navItem = event.target.closest(".sidebar-nav-item");
        if (navItem) {
            event.preventDefault();
            const pageId = navItem.dataset.nav;
            if (validatePageId(pageId)) {
                navigateTo(pageId);
            }
        }
    };

    // Register listeners with lifecycle manager
    globalLifecycleManager.addEventListener(window, "hashchange", handleHashChange);
    globalLifecycleManager.addEventListener(document, "click", handleNavClick);

    const initialPage = window.location.hash.slice(1) || "dashboard";
    navigateTo(initialPage);
}
