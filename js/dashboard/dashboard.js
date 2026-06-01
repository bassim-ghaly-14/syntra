import { createWidgets } from "./widgets.js";
import { initializeDragSystem } from "./dragSystem.js";

import {
    pushNotification
} from "../services/notificationService.js";

import {
    openModal
} from "../components/modal.js";

import {
    dashboardMetrics
} from "../data/metrics.js";

import {
    formatNumber,
    formatPercentage
} from "../utils/formatter.js";

import { globalLifecycleManager } from "../utils/lifecycle.js";
import { createSafeElement } from "../utils/sanitizer.js";

function initializeDashboardEvents() {

    const handleWidgetAction = (event) => {
        const action =
            event.target.closest(
                "[data-widget-action]"
            );

        if (!action) {
            return;
        }

        const type =
            action.dataset.widgetAction;

        switch (type) {

            case "refresh":

                pushNotification(
                    "Dashboard refreshed successfully",
                    "success"
                );

                createWidgets();

                break;

            case "analytics":

                // Build analytics content safely
                const analyticsContent = `
                    Revenue Growth: ${formatPercentage(dashboardMetrics.revenue.growth)}
                    Active Users: ${formatNumber(dashboardMetrics.activeUsers.current)}
                    Conversion Rate: ${formatPercentage(dashboardMetrics.conversions.current)}
                    Sessions: ${formatNumber(dashboardMetrics.sessions.current)}
                `;

                openModal({
                    title:
                        "Analytics Summary",

                    content: analyticsContent,

                    confirmText:
                        "Close"
                });

                break;

            case "export":

                openModal({
                    title:
                        "Export Dashboard",

                    content: `Export dashboard data as JSON using Command Palette.`,

                    confirmText:
                        "Understood"
                });

                break;
        }
    };

    globalLifecycleManager.addEventListener(
        document,
        "click",
        handleWidgetAction
    );
}

function initializeGsapEffects() {

    const gsap = window.CDNLibraries?.gsap;
    
    if (!gsap) {
        console.warn("GSAP library not available, skipping animations");
        return;
    }

    try {
        gsap.from(
            ".widget",
            {
                opacity: 0,
                y: 30,
                duration: 0.6,
                stagger: 0.08,
                ease: "power2.out"
            }
        );
    } catch (error) {
        console.error("GSAP animation error:", error);
    }
}

export function initializeDashboard() {

    createWidgets();

    initializeDragSystem();

    initializeDashboardEvents();

    setTimeout(() => {

        initializeGsapEffects();

        pushNotification(
            "Dashboard loaded",
            "success"
        );

    }, 300);
}
