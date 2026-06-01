import {
    showInfoToast,
    showSuccessToast,
    showWarningToast,
    showErrorToast
} from "../components/toast.js";

import { appState } from "../core/state.js";
import { sanitizeHTML } from "../utils/sanitizer.js";

const MAX_NOTIFICATIONS = 50;

function updateNotificationBadge() {
    const badge =
        document.getElementById(
            "notification-badge"
        );

    if (!badge) {
        return;
    }

    badge.textContent =
        appState.notifications.length
            .toString();
}

export function pushNotification(
    message,
    type = "info"
) {
    // Sanitize message to prevent XSS
    const sanitizedMessage = sanitizeHTML(message);

    if (!sanitizedMessage) {
        console.warn("Empty notification message");
        return null;
    }

    const notification = {
        id: crypto.randomUUID(),
        message: sanitizedMessage,
        type,
        createdAt: Date.now()
    };

    appState.notifications.push(
        notification
    );

    if (
        appState.notifications.length >
        MAX_NOTIFICATIONS
    ) {
        appState.notifications.shift();
    }

    updateNotificationBadge();

    try {
        switch (type) {
            case "success":
                showSuccessToast(sanitizedMessage);
                break;

            case "warning":
                showWarningToast(sanitizedMessage);
                break;

            case "error":
                showErrorToast(sanitizedMessage);
                break;

            default:
                showInfoToast(sanitizedMessage);
                break;
        }
    } catch (error) {
        console.error("Error displaying toast notification:", error);
    }

    return notification;
}

export function getNotifications() {
    return [
        ...appState.notifications
    ];
}

export function clearNotifications() {
    appState.notifications.length = 0;

    updateNotificationBadge();
}
