let activeDropdown = null;

function closeDropdown(dropdown) {
    if (!dropdown) {
        return;
    }

    dropdown.classList.remove("open");
}

function closeAllDropdowns() {
    document
        .querySelectorAll("[data-dropdown].open")
        .forEach(closeDropdown);

    activeDropdown = null;
}

export function toggleDropdown(target) {
    const dropdown =
        typeof target === "string"
            ? document.querySelector(target)
            : target;

    if (!dropdown) {
        return;
    }

    const shouldOpen =
        !dropdown.classList.contains("open");

    closeAllDropdowns();

    if (shouldOpen) {
        dropdown.classList.add("open");
        activeDropdown = dropdown;
    }
}

export function initializeDropdowns() {
    if (window.__syntraDropdownInitialized) {
        return;
    }

    window.__syntraDropdownInitialized = true;

    document.addEventListener(
        "click",
        event => {
            const trigger =
                event.target.closest(
                    "[data-dropdown-trigger]"
                );

            if (trigger) {
                const selector =
                    trigger.getAttribute(
                        "data-dropdown-trigger"
                    );

                const dropdown =
                    document.querySelector(
                        selector
                    );

                toggleDropdown(dropdown);

                return;
            }

            if (
                activeDropdown &&
                !event.target.closest(
                    "[data-dropdown]"
                )
            ) {
                closeAllDropdowns();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeAllDropdowns();
            }
        }
    );
}