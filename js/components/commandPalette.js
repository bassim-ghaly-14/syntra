import { openModal } from "./modal.js";
import { pushNotification } from "../services/notificationService.js";
import { exportJSON } from "../services/exportService.js";

let paletteElement = null;

const commands = [
    {
        id: "export-dashboard",
        label: "Export Dashboard Data",
        action() {
            exportJSON(
                {
                    exportedAt: new Date().toISOString(),
                    source: "SYNTRA"
                },
                "syntra-dashboard"
            );
        }
    },

    {
        id: "reset-layout",
        label: "Reset Layout",
        action() {
            localStorage.removeItem(
                "syntra-dashboard-layout"
            );

            pushNotification(
                "Layout reset completed",
                "success"
            );

            window.location.reload();
        }
    },

    {
        id: "dark-theme",
        label: "Switch To Dark Theme",
        action() {
            document.documentElement.setAttribute(
                "data-theme",
                "dark"
            );

            localStorage.setItem(
                "syntra-theme",
                "dark"
            );

            pushNotification(
                "Dark theme enabled",
                "success"
            );
        }
    },

    {
        id: "light-theme",
        label: "Switch To Light Theme",
        action() {
            document.documentElement.setAttribute(
                "data-theme",
                "light"
            );

            localStorage.setItem(
                "syntra-theme",
                "light"
            );

            pushNotification(
                "Light theme enabled",
                "success"
            );
        }
    },

    {
        id: "about",
        label: "About SYNTRA",
        action() {
            openModal({
                title: "About SYNTRA",

                content: `
                    <div class="command-about">
                        <p>
                            SYNTRA Analytics Dashboard
                        </p>

                        <p>
                            Advanced analytics and
                            monitoring platform.
                        </p>
                    </div>
                `,

                confirmText: "Close"
            });
        }
    }
];

function createPalette() {
    const wrapper =
        document.createElement("div");

    wrapper.id =
        "syntra-command-palette";

    wrapper.innerHTML = `
        <div
            class="command-palette-overlay"
        ></div>

        <div
            class="command-palette-window"
        >
            <div
                class="command-palette-header"
            >
                <input
                    id="command-search"
                    type="text"
                    placeholder="Type a command..."
                    autocomplete="off"
                >
            </div>

            <div
                id="command-results"
                class="command-palette-results"
            ></div>
        </div>
    `;

    document.body.appendChild(
        wrapper
    );

    return wrapper;
}

function getPalette() {
    if (!paletteElement) {
        paletteElement =
            createPalette();
    }

    return paletteElement;
}

function renderCommands(
    filteredCommands
) {
    const results =
        document.getElementById(
            "command-results"
        );

    if (!results) {
        return;
    }

    results.innerHTML =
        filteredCommands
            .map(
                command => `
                    <button
                        class="command-item"
                        data-command="${command.id}"
                    >
                        ${command.label}
                    </button>
                `
            )
            .join("");

    filteredCommands.forEach(
        command => {
            const element =
                document.querySelector(
                    `[data-command="${command.id}"]`
                );

            if (!element) {
                return;
            }

            element.addEventListener(
                "click",
                () => {
                    closeCommandPalette();

                    command.action();
                }
            );
        }
    );
}

export function openCommandPalette() {
    const palette =
        getPalette();

    palette.classList.add(
        "active"
    );

    const searchInput =
        document.getElementById(
            "command-search"
        );

    renderCommands(commands);

    searchInput.value = "";

    searchInput.focus();

    searchInput.oninput = event => {
        const query =
            event.target.value
                .trim()
                .toLowerCase();

        const filtered =
            commands.filter(
                command =>
                    command.label
                        .toLowerCase()
                        .includes(query)
            );

        renderCommands(
            filtered
        );
    };
}

export function closeCommandPalette() {
    const palette =
        getPalette();

    palette.classList.remove(
        "active"
    );
}

export function initializeCommandPalette() {
    const palette =
        getPalette();

    const overlay =
        palette.querySelector(
            ".command-palette-overlay"
        );

    overlay.addEventListener(
        "click",
        closeCommandPalette
    );

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.ctrlKey &&
                event.key.toLowerCase() ===
                    "k"
            ) {
                event.preventDefault();

                openCommandPalette();
            }

            if (
                event.key === "Escape"
            ) {
                closeCommandPalette();
            }
        }
    );

    const trigger =
        document.getElementById(
            "command-palette-trigger"
        );

    if (trigger) {
        trigger.addEventListener(
            "click",
            openCommandPalette
        );
    }
}