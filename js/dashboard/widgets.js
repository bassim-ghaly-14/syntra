import { formatCurrency } from "../utils/formatter.js";
import { generateId } from "../utils/helpers.js";

function createMetricCard({
    id,
    title,
    value,
    prefix = "",
    suffix = "",
    min = 100,
    max = 1000
}) {
    return `
        <div
            class="card widget metric-card"
            data-widget-id="${id}"
            data-metric="true"
            data-min="${min}"
            data-max="${max}"
        >
            <div class="metric-title">
                ${title}
            </div>

            <div class="metric-value">
                ${prefix}${value}${suffix}
            </div>
        </div>
    `;
}

function createChartCard({
    id,
    canvasId,
    title
}) {
    return `
        <div
            class="card widget chart-card"
            data-widget-id="${id}"
        >
            <div class="chart-header">
                ${title}
            </div>

            <canvas id="${canvasId}"></canvas>
        </div>
    `;
}

function initializeCharts() {
    const revenueCanvas =
        document.getElementById(
            "revenueChart"
        );

    const trafficCanvas =
        document.getElementById(
            "trafficChart"
        );

    if (typeof Chart === "undefined") {
        return;
    }

    if (revenueCanvas) {
        new Chart(revenueCanvas, {
            type: "line",
            data: {
                labels: [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri"
                ],
                datasets: [
                    {
                        label: "Revenue",
                        data: [
                            1200,
                            1900,
                            3000,
                            2500,
                            4000
                        ],
                        borderColor: "#00f0ff",
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    if (trafficCanvas) {
        new Chart(trafficCanvas, {
            type: "doughnut",
            data: {
                labels: [
                    "Organic",
                    "Ads",
                    "Referral"
                ],
                datasets: [
                    {
                        data: [
                            55,
                            25,
                            20
                        ],
                        backgroundColor: [
                            "#00f0ff",
                            "#6c63ff",
                            "#95a2c6"
                        ]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

function applyCountUp() {
    if (
        typeof countUp ===
        "undefined"
    ) {
        return;
    }

    const elements =
        document.querySelectorAll(
            ".metric-value"
        );

    elements.forEach(el => {
        const value =
            parseInt(
                el.textContent
                    .replace(
                        /[^0-9]/g,
                        ""
                    )
            ) || 0;

        el.innerHTML = "";

        new countUp.CountUp(
            el,
            value
        ).start();
    });
}

export function createWidgets() {
    const grid =
        document.getElementById(
            "dashboard-grid"
        );

    if (!grid) {
        return;
    }

    const revenueWidgetId =
        generateId();

    const trafficWidgetId =
        generateId();

    grid.innerHTML = `
        ${createMetricCard({
            id: generateId(),
            title: "Revenue",
            value: formatCurrency(
                24000
            ),
            prefix: "",
            min: 20000,
            max: 50000
        })}

        ${createMetricCard({
            id: generateId(),
            title: "Users",
            value: "12,400",
            min: 10000,
            max: 20000
        })}

        ${createChartCard({
            id: revenueWidgetId,
            canvasId: "revenueChart",
            title: "Revenue Overview"
        })}

        ${createChartCard({
            id: trafficWidgetId,
            canvasId: "trafficChart",
            title: "Traffic Sources"
        })}
    `;

    setTimeout(() => {
        initializeCharts();
        applyCountUp();
    }, 300);
}