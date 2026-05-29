export function createBarChart(canvas) {

    if (!canvas || typeof Chart === "undefined") {
        return null;
    }

    return new Chart(canvas, {
        type: "bar",

        data: {
            labels: [
                "Dashboard",
                "Analytics",
                "Reports",
                "Settings",
                "Activity"
            ],

            datasets: [
                {
                    label: "Page Views",

                    data: [
                        28440,
                        21930,
                        17600,
                        12880,
                        9440
                    ],

                    backgroundColor: [
                        "#00f0ff",
                        "#6c63ff",
                        "#00d084",
                        "#ffb020",
                        "#ff6b6b"
                    ],

                    borderRadius: 12,

                    borderSkipped: false
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
                x: {
                    grid: {
                        display: false
                    }
                },

                y: {
                    grid: {
                        color:
                            "rgba(255,255,255,0.04)"
                    }
                }
            }
        }
    });
}