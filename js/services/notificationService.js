import {
    showInfoToast,
    showSuccessToast,
    showWarningToast,
    showErrorToast
} from "../components/toast.js";

import { appState } from "../core/state.js";

const MAX_NOTIFICATIONS = 50;

function sanitizeHtml(input) {
    if (typeof input !== "string") {
        return "";
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    return doc.body.textContent || "";
}

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
    const sanitizedMessage = sanitizeHtml(message);

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