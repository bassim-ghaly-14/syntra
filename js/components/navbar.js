export function renderNavbar() {

    const navbar = document.getElementById("navbar");

    navbar.classList.add("navbar");

    navbar.innerHTML = `
        <h1>Analytics Dashboard</h1>
    `;

}