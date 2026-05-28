export function renderSidebar() {

    const sidebar = document.getElementById("sidebar");

    sidebar.classList.add("sidebar");

    sidebar.innerHTML = `
        <div class="sidebar-logo" >
            <img src="./assets/logo/logo.png" alt="SYNTRA logo">
            <h2>SYNTRA</h2>
        </div>
    `;

}