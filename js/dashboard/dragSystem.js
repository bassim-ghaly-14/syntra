import {
    saveLayout
} from "./layoutManager.js";

import {
    pushNotification
} from "../services/notificationService.js";

export function initializeDragSystem() {
    const grid =
        document.getElementById(
            "dashboard-grid"
        );

    if (
        !grid ||
        typeof Sortable ===
            "undefined"
    ) {
        return;
    }

    Sortable.create(grid, {
        animation: 250,

        ghostClass:
            "widget-dragging",

        onEnd() {
            saveLayout();

            pushNotification(
                "Dashboard layout saved",
                "success"
            );
        }
    });
}