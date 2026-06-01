import { pushNotification } from "./notificationService.js";
import { formatNumber } from "../utils/formatter.js";

let realtimeInterval = null;

function generateMetricValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function updateMetricCards() {
    const metrics = document.querySelectorAll("[data-metric]");
    
    metrics.forEach(metric => {
        const min = Number(metric.dataset.min) || 100;
        const max = Number(metric.dataset.max) || 1000;
        const value = generateMetricValue(min, max);
        
        const valueElement = metric.querySelector(".metric-value");
        if (valueElement) {
            valueElement.dataset.counter = value;
            valueElement.textContent = formatNumber(value);
        }
    });
}

export function startRealtimeEngine() {
    stopRealtimeEngine();
    
    realtimeInterval = setInterval(() => {
        updateMetricCards();
    }, 3000);
    
    pushNotification("Realtime engine started", "success");
}

export function stopRealtimeEngine() {
    if (realtimeInterval) {
        clearInterval(realtimeInterval);
        realtimeInterval = null;
    }
}