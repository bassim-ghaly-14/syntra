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

/**
 * Chart instance registry to prevent memory leaks
 */
const chartRegistry = new Map();

function destroyChart(canvasId) {
    if (chartRegistry.has(canvasId)) {
        const chart = chartRegistry.get(canvasId);
        if (chart && typeof chart.destroy === "function") {
            try {
                chart.destroy();
            } catch (error) {
                console.error(`Error destroying chart ${canvasId}:`, error);
            }
        }
        chartRegistry.delete(canvasId);
    }
}

function registerChart(canvasId, chartInstance) {
    if (chartInstance) {
        chartRegistry.set(canvasId, chartInstance);
    }
}

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
            role="article"
            aria-label="${title}: ${value}"
        >
            <div class="metric-top">
                <div class="metric-icon" aria-hidden="true">
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
            role="article"
            aria-label="${title} chart"
        >
            <div class="widget-header">
                <div>
                    <h3>${title}</h3>
                </div>

                <button
                    class="widget-action"
                    data-widget-action="${action}"
                    aria-label="View ${title} details"
                    type="button"
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
            role="article"
            aria-label="Heatmap"
        >
            <div class="widget-header">
                <h3>User Activity Heatmap</h3>
            </div>

            <div class="widget-body" id="heatmap-container"></div>
        </div>
    `;
}

function createTopPagesWidget() {
    const id = widgetRegistry.getStableId("top-pages");

    const pagesHtml = topPages
        .map(
            page => `
                <div class="top-page-row">
                    <span class="top-page-name">${page.name}</span>
                    <span class="top-page-views">${formatNumber(page.views)}</span>
                </div>
            `
        )
        .join("");

    return `
        <div
            class="card widget top-pages-widget"
            data-widget-id="${id}"
            data-key="top-pages"
            role="article"
            aria-label="Top pages"
        >
            <div class="widget-header">
                <h3>Top Pages</h3>
            </div>

            <div class="widget-body">
                <div class="top-pages-list">
                    ${pagesHtml}
                </div>
            </div>
        </div>
    `;
}

export function createWidgets() {
    const grid = document.getElementById("dashboard-grid");
    
    if (!grid) {
        console.error("Dashboard grid element not found");
        return;
    }

    try {
        // Destroy existing charts to prevent memory leaks
        chartRegistry.forEach((chart, canvasId) => {
            destroyChart(canvasId);
        });

        const html = `
            ${createMetricCard({
                key: "revenue",
                title: "Revenue",
                value: formatCurrency(dashboardMetrics.revenue.current),
                growth: dashboardMetrics.revenue.growth,
                min: 50000,
                max: 100000,
                color: "cyan",
                svgHtml: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
            })}
            ${createMetricCard({
                key: "users",
                title: "Active Users",
                value: formatNumber(dashboardMetrics.activeUsers.current),
                growth: dashboardMetrics.activeUsers.growth,
                min: 10000,
                max: 25000,
                color: "purple",
                svgHtml: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`
            })}
            ${createMetricCard({
                key: "conversions",
                title: "Conversion Rate",
                value: formatPercentage(dashboardMetrics.conversions.current),
                growth: dashboardMetrics.conversions.growth,
                min: 2,
                max: 8,
                color: "green",
                svgHtml: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>`
            })}
            ${createMetricCard({
                key: "sessions",
                title: "Sessions",
                value: formatNumber(dashboardMetrics.sessions.current),
                growth: dashboardMetrics.sessions.growth,
                min: 80000,
                max: 150000,
                color: "orange",
                svgHtml: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12h-8v2h8v-2zm0-3h-8v2h8V11zm0-3h-8v2h8V8z"/></svg>`
            })}
            ${createChartWidget({
                key: "revenue-trend",
                title: "Revenue Trend",
                canvasId: "revenue-chart"
            })}
            ${createChartWidget({
                key: "traffic-sources",
                title: "Traffic Sources",
                canvasId: "traffic-chart"
            })}
            ${createChartWidget({
                key: "user-growth",
                title: "User Growth",
                canvasId: "user-growth-chart"
            })}
            ${createChartWidget({
                key: "device-distribution",
                title: "Device Distribution",
                canvasId: "device-chart"
            })}
            ${createChartWidget({
                key: "conversion-funnel",
                title: "Conversion Funnel",
                canvasId: "conversion-chart"
            })}
            ${createChartWidget({
                key: "engagement-metrics",
                title: "Engagement Metrics",
                canvasId: "engagement-chart"
            })}
            ${createHeatmapWidget()}
            ${createTopPagesWidget()}
        `;

        grid.innerHTML = html;

        // Initialize charts safely
        const Chart = window.CDNLibraries?.Chart;
        if (Chart && typeof Chart === 'object') {
            try {
                const revenueChartCanvas = document.getElementById("revenue-chart");
                if (revenueChartCanvas) {
                    const chart = createAreaChart(revenueChartCanvas);
                    registerChart("revenue-chart", chart);
                }

                const trafficChartCanvas = document.getElementById("traffic-chart");
                if (trafficChartCanvas) {
                    const chart = createDonutChart(trafficChartCanvas);
                    registerChart("traffic-chart", chart);
                }

                const userGrowthCanvas = document.getElementById("user-growth-chart");
                if (userGrowthCanvas) {
                    const chart = createLineChart(userGrowthCanvas);
                    registerChart("user-growth-chart", chart);
                }

                const deviceChartCanvas = document.getElementById("device-chart");
                if (deviceChartCanvas) {
                    const chart = createBarChart(deviceChartCanvas);
                    registerChart("device-chart", chart);
                }

                const conversionChartCanvas = document.getElementById("conversion-chart");
                if (conversionChartCanvas) {
                    const chart = createRadarChart(conversionChartCanvas);
                    registerChart("conversion-chart", chart);
                }

                const engagementChartCanvas = document.getElementById("engagement-chart");
                if (engagementChartCanvas) {
                    const chart = createHeatmapChart(engagementChartCanvas);
                    registerChart("engagement-chart", chart);
                }
            } catch (error) {
                console.error("Chart initialization error:", error);
            }
        } else {
            console.warn("Chart.js library not available, charts will not render");
        }

    } catch (error) {
        console.error("Widget creation error:", error);
    }
}

function formatCurrency(value) {
    return `$${formatNumber(value)}`;
}
