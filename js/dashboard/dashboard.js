import { createWidgets } from "./widgets.js";
import { initializeDragSystem } from "./dragSystem.js";

import {
    pushNotification
} from "../services/notificationService.js";

import {
    openModal
} from "../components/modal.js";

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
                                        +9.7%
                                    </span>
                                </div>

                                <div class="modal-stat">
                                    <strong>
                                        Active Users
                                    </strong>

                                    <span>
                                        18,432
                                    </span>
                                </div>

                                <div class="modal-stat">
                                    <strong>
                                        Conversion Rate
                                    </strong>

                                    <span>
                                        4.82%
                                    </span>
                                </div>

                                <div class="modal-stat">
                                    <strong>
                                        Sessions
                                    </strong>

                                    <span>
                                        128,420
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