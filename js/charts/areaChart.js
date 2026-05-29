export function createAreaChart(canvas) {

    if (!canvas || typeof Chart === "undefined") {
        return null;
    }

    return new Chart(canvas, {
        type: "line",

        data: {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ],

            datasets: [
                {
                    label: "Revenue",

                    data: [
                        8200,
                        9400,
                        11800,
                        12600,
                        14200,
                        15700,
                        18400,
                        20300,
                        21800,
                        24100,
                        26800,
                        31200
                    ],

                    fill: true,

                    borderWidth: 3,

                    borderColor: "#00f0ff",

                    backgroundColor:
                        "rgba(0,240,255,0.12)",

                    tension: 0.45,

                    pointRadius: 4,

                    pointHoverRadius: 7
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