import { renderSidebar } from "../components/sidebar.js";
import { renderNavbar } from "../components/navbar.js";
import { initializeDashboard } from "../dashboard/dashboard.js";

export function initializeApp() {

    renderSidebar();
    renderNavbar();
    initializeDashboard();

}