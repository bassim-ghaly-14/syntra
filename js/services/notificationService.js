import {
    showInfoToast,
    showSuccessToast,
    showWarningToast,
    showErrorToast
} from "../components/toast.js";

import { appState } from "../core/state.js";

const MAX_NOTIFICATIONS = 50;

export function pushNotification(message, type = "info") {
    const notification = {
        id: crypto.randomUUID(),
        message,
        type,
        createdAt: Date.now()
    };
    
    appState.notifications.push(notification);
    
    if (appState.notifications.length > MAX_NOTIFICATIONS) {
        appState.notifications.shift();
    }
    
    switch (type) {
        case "success":
            showSuccessToast(message);
            break;
        case "warning":
            showWarningToast(message);
            break;
        case "error":
            showErrorToast(message);
            break;
        default:
            showInfoToast(message);
            break;
    }
    
    return notification;
}

export function getNotifications() {
    return [...appState.notifications];
}

export function clearNotifications() {
    appState.notifications.length = 0;
}