const navigationItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: ""
    },
    {
        id: "analytics",
        label: "Analytics",
        icon: ""
    },
    {
        id: "reports",
        label: "Reports",
        icon: ""
    },
    {
        id: "activity",
        label: "Activity",
        icon: ""
    },
    {
        id: "users",
        label: "Users",
        icon: ""
    },
    {
        id: "settings",
        label: "Settings",
        icon: ""
    }
];

function createNavigationItem(item) {
    return `
        <a
            href="#"
            class="sidebar-nav-item"
            data-nav="${item.id}"
        >
            <span
                class="sidebar-nav-icon"
                ${item.icon ? `style="background-image:url('${item.icon}')"` : ""}
            ></span>

            <span class="sidebar-nav-label">
                ${item.label}
            </span>
        </a>
    `;
}

function attachNavigationEvents() {
    const items =
        document.querySelectorAll(
            ".sidebar-nav-item"
        );

    items.forEach(item => {
        item.addEventListener(
            "click",
            event => {
                event.preventDefault();

                document
                    .querySelectorAll(
                        ".sidebar-nav-item"
                    )
                    .forEach(link => {
                        link.classList.remove(
                            "active"
                        );
                    });

                item.classList.add(
                    "active"
                );
            }
        );
    });
}

export function renderSidebar() {
    const sidebar =
        document.getElementById(
            "sidebar"
        );

    if (!sidebar) {
        return;
    }

    sidebar.className =
        "sidebar";

    sidebar.innerHTML = `
        <div class="sidebar-header">

            <div class="sidebar-brand">

                <div class="sidebar-brand-logo">
                    <img
                        src="assets/logo/logo.png"
                        alt="Syntra Logo"
                    >
                </div>

                <div class="sidebar-brand-content">
                    <h2>SYNTRA</h2>

                    <p>
                        Analytics Platform
                    </p>
                </div>

            </div>

        </div>

        <div class="sidebar-divider"></div>

        <nav class="sidebar-navigation">
            ${navigationItems
                .map(
                    createNavigationItem
                )
                .join("")}
        </nav>

        <div class="sidebar-footer">

            <div class="sidebar-user">

                <div
                    class="sidebar-user-avatar"
                >
                    <img
                        src=""
                        alt="User Avatar"
                    >
                </div>

                <div
                    class="sidebar-user-info"
                >
                    <strong>
                        Admin User
                    </strong>

                    <span>
                        System Owner
                    </span>
                </div>

            </div>

        </div>
    `;

    const firstItem =
        sidebar.querySelector(
            ".sidebar-nav-item"
        );

    if (firstItem) {
        firstItem.classList.add(
            "active"
        );
    }

    attachNavigationEvents();
}