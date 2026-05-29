import {
    formatCurrency,
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

function createMetricCard({
    title,
    value,
    growth,
    icon,
    min,
    max,
    color = "cyan"
}) {

    return `
        <div
            class="card widget metric-widget metric-${color}"
            data-widget-id="${generateId()}"
            data-metric="true"
            data-min="${min}"
            data-max="${max}"
        >

            <div class="metric-top">

                <div class="metric-icon">
                    <img
                        src="${icon}"
                        alt="${title}"
                    >
                </div>

                <div class="metric-growth positive">
                    +${growth}%
                </div>

            </div>

            <div class="metric-title">
                ${title}
            </div>

            <div
                class="metric-value"
                data-counter="${value}"
            >
                ${value}
            </div>

        </div>
    `;
}

function createChartWidget({
    title,
    canvasId,
    action = "analytics"
}) {

    return `
        <div
            class="card widget chart-widget"
            data-widget-id="${generateId()}"
        >

            <div class="widget-header">

                <div>

                    <h3>
                        ${title}
                    </h3>

                </div>

                <button
                    class="widget-action"
                    data-widget-action="${action}"
                >
                    View
                </button>

            </div>

            <div class="widget-body">

                <canvas
                    id="${canvasId}"
                ></canvas>

            </div>

        </div>
    `;
}

function createHeatmapWidget() {

    return `
        <div
            class="card widget heatmap-widget"
            data-widget-id="${generateId()}"
        >

            <div class="widget-header">

                <h3>
                    Global Activity Map
                </h3>

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

    return `
        <div
            class="card widget pages-widget"
            data-widget-id="${generateId()}"
        >

            <div class="widget-header">

                <h3>
                    Top Pages
                </h3>

            </div>

            <div class="top-pages-list">

                ${topPages.map(page => `
                    <div class="top-page-row">

                        <div
                            class="top-page-name"
                        >
                            ${page.page}
                        </div>

                        <div
                            class="top-page-views"
                        >
                            ${formatNumber(
                                page.views
                            )}
                        </div>

                    </div>
                `).join("")}

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

    if (
        typeof countUp ===
        "undefined"
    ) {
        return;
    }

    document
        .querySelectorAll(
            "[data-counter]"
        )
        .forEach(element => {

            const raw =
                Number(
                    element.dataset.counter
                        .toString()
                        .replace(
                            /[^0-9.]/g,
                            ""
                        )
                );

            if (
                Number.isNaN(raw)
            ) {
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

    if (
        typeof gsap ===
        "undefined"
    ) {
        return;
    }

    gsap.from(
        ".widget",
        {
            opacity: 0,
            y: 20,
            stagger: 0.05,
            duration: 0.5,
            ease: "power2.out"
        }
    );
}

export function createWidgets() {

    const grid =
        document.getElementById(
            "dashboard-grid"
        );

    if (!grid) {
        return;
    }

    grid.innerHTML = `

        ${createMetricCard({
            title: "Revenue",
            value: dashboardMetrics.revenue.current,
            growth: dashboardMetrics.revenue.growth,
            icon: "./assets/icons/dollar-sign.svg",
            min: 70000,
            max: 100000,
            color: "cyan"
        })}

        ${createMetricCard({
            title: "Active Users",
            value: dashboardMetrics.activeUsers.current,
            growth: dashboardMetrics.activeUsers.growth,
            icon: "./assets/icons/users.svg",
            min: 15000,
            max: 25000,
            color: "purple"
        })}

        ${createMetricCard({
            title: "Sessions",
            value: dashboardMetrics.sessions.current,
            growth: dashboardMetrics.sessions.growth,
            icon: "./assets/icons/activity.svg",
            min: 100000,
            max: 160000,
            color: "green"
        })}

        ${createMetricCard({
            title: "Conversion Rate",
            value: dashboardMetrics.conversions.current,
            growth: dashboardMetrics.conversions.growth,
            icon: "./assets/icons/trending-up.svg",
            min: 3,
            max: 8,
            color: "orange"
        })}

        ${createChartWidget({
            title: "Revenue Overview",
            canvasId:
                "revenueAreaChart"
        })}

        ${createChartWidget({
            title: "Traffic Sources",
            canvasId:
                "trafficDonutChart"
        })}

        ${createChartWidget({
            title: "User Growth",
            canvasId:
                "usersLineChart"
        })}

        ${createChartWidget({
            title: "Top Pages",
            canvasId:
                "pagesBarChart"
        })}

        ${createChartWidget({
            title:
                "Performance Radar",
            canvasId:
                "performanceRadarChart"
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