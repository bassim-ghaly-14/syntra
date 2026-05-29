export function createDonutChart(canvas) {

    if (!canvas || typeof Chart === "undefined") {
        return null;
    }

    return new Chart(canvas, {
        type: "doughnut",

        data: {
            labels: [
                "Organic",
                "Paid",
                "Referral",
                "Social",
                "Email"
            ],

            datasets: [
                {
                    data: [
                        44,
                        24,
                        14,
                        11,
                        7
                    ],

                    backgroundColor: [
                        "#00f0ff",
                        "#6c63ff",
                        "#00d084",
                        "#ffb020",
                        "#ff6b6b"
                    ],

                    borderWidth: 0,

                    hoverOffset: 12
                }
            ]
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom",

                    labels: {
                        color: "#95a2c6",
                        padding: 20
                    }
                }
            },

            cutout: "72%"
        }
    });
}