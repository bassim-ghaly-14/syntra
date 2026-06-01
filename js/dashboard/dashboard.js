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

function initializeDashboardEvents() {

    document.addEventListener(
        "click",
        event => {

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

                    openModal({
                        title:
                            "Analytics Summary",

                        content: `
                            <div class="dashboard-modal-content">

                                <div class="modal-stat">
                                    <strong>
                                        Revenue Growth
                                    </strong>

                                    <span>
                                        ${formatPercentage(dashboardMetrics.revenue.growth)}
                                    </span>
                                </div>

                                <div class="modal-stat">
                                    <strong>
                                        Active Users
                                    </strong>

                                    <span>
                                        ${formatNumber(dashboardMetrics.activeUsers.current)}
                                    </span>
                                </div>

                                <div class="modal-stat">
                                    <strong>
                                        Conversion Rate
                                    </strong>

                                    <span>
                                        ${formatPercentage(dashboardMetrics.conversions.current)}
                                    </span>
                                </div>

                                <div class="modal-stat">
                                    <strong>
                                        Sessions
                                    </strong>

                                    <span>
                                        ${formatNumber(dashboardMetrics.sessions.current)}
                                    </span>
                                </div>

                            </div>
                        `,

                        confirmText:
                            "Close"
                    });

                    break;

                case "export":

                    openModal({
                        title:
                            "Export Dashboard",

                        content: `
                            <p>
                                Export dashboard data
                                as JSON using
                                Command Palette.
                            </p>
                        `,

                        confirmText:
                            "Understood"
                    });

                    break;
            }
        }
    );
}

function initializeGsapEffects() {

    if (
        typeof gsap === "undefined"
    ) {
        return;
    }

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