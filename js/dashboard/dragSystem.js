import {
    saveLayout
} from "./layoutManager.js";

import {
    pushNotification
} from "../services/notificationService.js";

import { globalLifecycleManager } from "../utils/lifecycle.js";

export function initializeDragSystem() {
    const grid =
        document.getElementById(
            "dashboard-grid"
        );

    const Sortable = window.CDNLibraries?.Sortable;

    if (
        !grid ||
        !Sortable
    ) {
        console.warn("Sortable library not available, drag functionality disabled");
        return;
    }

    try {
        const sortableInstance = Sortable.create(grid, {
            animation: 250,

            ghostClass:
                "widget-dragging",

            onEnd() {
                try {
                    saveLayout();

                    pushNotification(
                        "Dashboard layout saved",
                        "success"
                    );
                } catch (error) {
                    console.error("Layout save error:", error);
                    pushNotification(
                        "Failed to save layout",
                        "error"
                    );
                }
            },

            onError(error) {
                console.error("Drag system error:", error);
            }
        });

        // Cleanup on global lifecycle deactivate
        const originalCleanup = globalLifecycleManager.deactivate.bind(globalLifecycleManager);
        globalLifecycleManager.deactivate = function() {
            if (sortableInstance) {
                sortableInstance.destroy();
            }
            originalCleanup();
        };
    } catch (error) {
        console.error("Failed to initialize drag system:", error);
        pushNotification(
            "Drag and drop not available",
            "warning"
        );
    }
}
