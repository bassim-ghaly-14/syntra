export function createLineChart(canvas) {

    if (!canvas || typeof Chart === "undefined") {
        return null;
    }

    return new Chart(canvas, {
        type: "line",

        data: {
            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            datasets: [
                {
                    label: "Active Users",

                    data: [
                        12400,
                        12900,
                        13800,
                        14500,
                        15200,
                        16700,
                        18432
                    ],

                    borderColor: "#6c63ff",

                    backgroundColor:
                        "rgba(108,99,255,0.15)",

                    fill: true,

                    tension: 0.4,

                    borderWidth: 3,

                    pointRadius: 4
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
                        color:
                            "rgba(255,255,255,0.04)"
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