export function createWidgets() {

    const grid = document.getElementById("dashboard-grid");

    grid.innerHTML = `
        <div class="card widget">
            <canvas id="revenueChart"></canvas>
        </div>

        <div class="card widget">
            <canvas id="trafficChart"></canvas>
        </div>
    `;

    const revenueCanvas = document.getElementById("revenueChart");

    new Chart(revenueCanvas, {
        type: "line",

        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],

            datasets: [{
                label: "Revenue",
                data: [12, 19, 7, 22, 31]
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

}
