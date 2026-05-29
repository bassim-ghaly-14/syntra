export function createHeatmapChart(container) {

    if (!container) {
        return;
    }

    const values = [
        12, 34, 65, 21, 87, 45, 78,
        55, 24, 91, 66, 18, 73, 42,
        81, 36, 57, 99, 28, 63, 74,
        14, 52, 89, 31, 67, 93, 47,
        76, 39, 58, 84, 26, 71, 96
    ];

    container.innerHTML = `
        <div class="syntra-heatmap">
            ${values.map(value => `
                <div
                    class="heatmap-cell"
                    style="
                        opacity:${Math.max(
                            value / 100,
                            0.15
                        )};
                    "
                    title="${value}"
                >
                    ${value}
                </div>
            `).join("")}
        </div>
    `;
}