import {
    formatNumber,
    formatPercentage
} from "../utils/formatter.js";

import {
    generateId
} from "../utils/helpers.js";

import {
    dashboardMetrics,
    topPages
} from "../data/metrics.js";

import {
    createAreaChart
} from "../charts/areaChart.js";

import {
    createLineChart
} from "../charts/lineChart.js";

import {
    createBarChart
} from "../charts/barChart.js";

import {
    createDonutChart
} from "../charts/donutChart.js";

import {
    createRadarChart
} from "../charts/radarChart.js";

import {
    createHeatmapChart
} from "../charts/heatmapChart.js";

/**
 * Stable widget registry to prevent layout break
 */
const widgetRegistry = {
    map: new Map(),
    getStableId(key) {
        if (!this.map.has(key)) {
            this.map.set(key, generateId());
        }
        return this.map.get(key);
    }
};

function createMetricCard({
    key,
    title,
    value,
    growth,
    min,
    max,
    color = "cyan",
    svgHtml
}) {
    const id = widgetRegistry.getStableId(key);

    return `
        <div
            class="card widget metric-widget metric-${color}"
            data-widget-id="${id}"
            data-metric="true"
            data-min="${min}"
            data-max="${max}"
            data-key="${key}"
        >
            <div class="metric-top">
                <div class="metric-icon">
                    ${svgHtml}
                </div>

                <div class="metric-growth positive">
                    +${growth}%
                </div>
            </div>

            <div class="metric-title">
                ${title}
            </div>

            <div class="metric-value"
                 data-counter="${value}">
                ${value}
            </div>
        </div>
    `;
}

function createChartWidget({
    key,
    title,
    canvasId,
    action = "analytics"
}) {
    const id = widgetRegistry.getStableId(key);

    return `
        <div
            class="card widget chart-widget"
            data-widget-id="${id}"
            data-key="${key}"
        >
            <div class="widget-header">
                <div>
                    <h3>${title}</h3>
                </div>

                <button
                    class="widget-action"
                    data-widget-action="${action}"
                >
                    View
                </button>
            </div>

            <div class="widget-body">
                <canvas id="${canvasId}"></canvas>
            </div>
        </div>
    `;
}

function createHeatmapWidget() {
    const id = widgetRegistry.getStableId("heatmap");

    return `
        <div
            class="card widget heatmap-widget"
            data-widget-id="${id}"
            data-key="heatmap"
        >
            <div class="widget-header">
                <h3>Global Activity Map</h3>

                <button
                    class="widget-action"
                    data-widget-action="analytics"
                >
                    View
                </button>
            </div>

            <div
                id="heatmapContainer"
                class="heatmap-container"
            ></div>
        </div>
    `;
}

function createTopPagesWidget() {
    const id = widgetRegistry.getStableId("top-pages");

    return `
        <div
            class="card widget pages-widget"
            data-widget-id="${id}"
            data-key="top-pages"
        >
            <div class="widget-header">
                <h3>Top Pages</h3>
            </div>

            <div class="top-pages-list">
                ${topPages
                    .map(
                        page => `
                        <div class="top-page-row">
                            <div class="top-page-name">
                                ${page.page}
                            </div>

                            <div class="top-page-views">
                                ${formatNumber(page.views)}
                            </div>
                        </div>
                    `
                    )
                    .join("")}
            </div>
        </div>
    `;
}

function initializeCharts() {
    createAreaChart(
        document.getElementById(
            "revenueAreaChart"
        )
    );

    createLineChart(
        document.getElementById(
            "usersLineChart"
        )
    );

    createDonutChart(
        document.getElementById(
            "trafficDonutChart"
        )
    );

    createBarChart(
        document.getElementById(
            "pagesBarChart"
        )
    );

    createRadarChart(
        document.getElementById(
            "performanceRadarChart"
        )
    );

    createHeatmapChart(
        document.getElementById(
            "heatmapContainer"
        )
    );
}

function initializeCountUp() {
    if (typeof countUp === "undefined") {
        return;
    }

    document
        .querySelectorAll(
            "[data-counter]"
        )
        .forEach(element => {
            const raw = Number(
                element.dataset.counter
                    .toString()
                    .replace(
                        /[^0-9.]/g,
                        ""
                    )
            );

            if (Number.isNaN(raw)) {
                return;
            }

            element.innerHTML = "";

            const counter =
                new countUp.CountUp(
                    element,
                    raw,
                    {
                        duration: 2
                    }
                );

            counter.start();
        });
}

function initializeWidgetAnimations() {
    if (typeof gsap === "undefined") {
        return;
    }

    gsap.from(".widget", {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out"
    });
}

export async function createWidgets() {
    const grid = document.getElementById(
        "dashboard-grid"
    );

    if (!grid) {
        return;
    }

    const revenueIcon = await fetch(
        "./assets/icons/dollar-sign.svg"
    )
        .then(r => r.text())
        .catch(() => "");

    const usersIcon = await fetch(
        "./assets/icons/users.svg"
    )
        .then(r => r.text())
        .catch(() => "");

    const sessionsIcon = await fetch(
        "./assets/icons/activity.svg"
    )
        .then(r => r.text())
        .catch(() => "");

    const conversionsIcon = await fetch(
        "./assets/icons/trending-up.svg"
    )
        .then(r => r.text())
        .catch(() => "");

    grid.innerHTML = `
        ${createMetricCard({
            key: "revenue",
            title: "Revenue",
            value: dashboardMetrics.revenue.current,
            growth: dashboardMetrics.revenue.growth,
            min: 70000,
            max: 100000,
            color: "cyan",
            svgHtml: revenueIcon
        })}

        ${createMetricCard({
            key: "active-users",
            title: "Active Users",
            value: dashboardMetrics.activeUsers.current,
            growth: dashboardMetrics.activeUsers.growth,
            min: 15000,
            max: 25000,
            color: "purple",
            svgHtml: usersIcon
        })}

        ${createMetricCard({
            key: "sessions",
            title: "Sessions",
            value: dashboardMetrics.sessions.current,
            growth: dashboardMetrics.sessions.growth,
            min: 100000,
            max: 160000,
            color: "green",
            svgHtml: sessionsIcon
        })}

        ${createMetricCard({
            key: "conversion-rate",
            title: "Conversion Rate",
            value: dashboardMetrics.conversions.current,
            growth: dashboardMetrics.conversions.growth,
            min: 3,
            max: 8,
            color: "orange",
            svgHtml: conversionsIcon
        })}

        ${createChartWidget({
            key: "revenue-chart",
            title: "Revenue Overview",
            canvasId: "revenueAreaChart"
        })}

        ${createChartWidget({
            key: "traffic-chart",
            title: "Traffic Sources",
            canvasId: "trafficDonutChart"
        })}

        ${createChartWidget({
            key: "users-chart",
            title: "User Growth",
            canvasId: "usersLineChart"
        })}

        ${createChartWidget({
            key: "pages-chart",
            title: "Top Pages",
            canvasId: "pagesBarChart"
        })}

        ${createChartWidget({
            key: "performance-chart",
            title: "Performance Radar",
            canvasId: "performanceRadarChart"
        })}

        ${createHeatmapWidget()}

        ${createTopPagesWidget()}
    `;

    requestAnimationFrame(() => {
        initializeCharts();
        initializeCountUp();
        initializeWidgetAnimations();
    });
}