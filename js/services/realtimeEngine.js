import {
    pushNotification
} from "./notificationService.js";

import {
    formatCurrency,
    formatNumber,
    formatPercentage
} from "../utils/formatter.js";

let realtimeInterval = null;

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
}

export function startRealtimeEngine() {
    stopRealtimeEngine();

    realtimeInterval =
        setInterval(() => {
            updateMetricCards();
        }, 3000);

    pushNotification(
        "Realtime engine started",
        "success"
    );
}

export function stopRealtimeEngine() {
    if (!realtimeInterval) {
        return;
    }

    clearInterval(
        realtimeInterval
    );

    realtimeInterval = null;
}