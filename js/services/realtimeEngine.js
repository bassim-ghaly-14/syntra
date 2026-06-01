import {
    pushNotification
} from "./notificationService.js";

import {
    formatCurrency,
    formatNumber,
    formatPercentage
} from "../utils/formatter.js";

import { globalLifecycleManager } from "../utils/lifecycle.js";

let realtimeInterval = null;
let isRunning = false;

function generateMetricValue(
    min,
    max
) {
    return Math.floor(
        Math.random() *
            (max - min + 1) +
            min
    );
}

function formatMetricValue(
    metricType,
    value
) {
    switch (metricType) {
        case "Revenue":
            return formatCurrency(
                value
            );

        case "Conversion Rate":
            return formatPercentage(
                value
            );

        default:
            return formatNumber(
                value
            );
    }
}

function updateMetricCards() {
    if (!globalLifecycleManager.isAlive()) {
        stopRealtimeEngine();
        return;
    }

    try {
        const metrics =
            document.querySelectorAll(
                "[data-metric]"
            );

        metrics.forEach(metric => {
            const min =
                Number(
                    metric.dataset.min
                ) || 100;

            const max =
                Number(
                    metric.dataset.max
                ) || 1000;

            let value =
                generateMetricValue(
                    min,
                    max
                );

            const title =
                metric.querySelector(
                    ".metric-title"
                )?.textContent?.trim() ||
                "";

            if (
                title ===
                "Conversion Rate"
            ) {
                value =
                    Number(
                        (
                            Math.random() *
                                (8 - 3) +
                            3
                        ).toFixed(2)
                    );
            }

            const valueElement =
                metric.querySelector(
                    ".metric-value"
                );

            if (!valueElement) {
                return;
            }

            valueElement.dataset.counter =
                value;

            valueElement.textContent =
                formatMetricValue(
                    title,
                    value
                );
        });
    } catch (error) {
        console.error("Error updating metrics:", error);
    }
}

export function startRealtimeEngine() {
    if (isRunning) {
        return;
    }

    if (!globalLifecycleManager.isAlive()) {
        globalLifecycleManager.activate();
    }

    try {
        isRunning = true;
        realtimeInterval =
            globalLifecycleManager.setInterval(() => {
                updateMetricCards();
            }, 3000);

        pushNotification(
            "Realtime engine started",
            "success"
        );
    } catch (error) {
        console.error("Failed to start realtime engine:", error);
        isRunning = false;
    }
}

export function stopRealtimeEngine() {
    if (!realtimeInterval) {
        return;
    }

    try {
        globalLifecycleManager.clearInterval(realtimeInterval);
        realtimeInterval = null;
        isRunning = false;
    } catch (error) {
        console.error("Error stopping realtime engine:", error);
    }
}

export function isRealtimeEngineRunning() {
    return isRunning;
}
