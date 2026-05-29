export function createRadarChart(canvas) {

    if (!canvas || typeof Chart === "undefined") {
        return null;
    }

    return new Chart(canvas, {
        type: "radar",

        data: {
            labels: [
                "Speed",
                "SEO",
                "Security",
                "Accessibility",
                "Retention",
                "Conversion"
            ],

            datasets: [
                {
                    label: "Performance",

                    data: [
                        92,
                        89,
                        94,
                        88,
                        82,
                        91
                    ],

                    borderColor: "#00f0ff",

                    backgroundColor:
                        "rgba(0,240,255,0.18)",

                    borderWidth: 2,

                    pointBackgroundColor:
                        "#00f0ff"
                }
            ]
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                r: {
                    angleLines: {
                        color:
                            "rgba(255,255,255,0.08)"
                    },

                    grid: {
                        color:
                            "rgba(255,255,255,0.08)"
                    },

                    pointLabels: {
                        color: "#95a2c6"
                    },

                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}