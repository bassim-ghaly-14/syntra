const STORAGE_KEY =
    "syntra-dashboard-layout";

export function saveLayout() {
    try {
        const widgets = [
            ...document.querySelectorAll(
                ".widget"
            )
        ];

        const layout =
            widgets.map(
                widget =>
                    widget.dataset
                        .widgetId
            );

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(layout)
        );
    } catch (error) {
        console.error(error);
    }
}

export function loadLayout() {
    try {
        const savedLayout =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!savedLayout) {
            return;
        }

        const layout =
            JSON.parse(savedLayout);

        if (
            !Array.isArray(layout)
        ) {
            return;
        }

        const grid =
            document.getElementById(
                "dashboard-grid"
            );

        if (!grid) {
            return;
        }

        const attemptReorder =
            () => {
                const widgets =
                    grid.querySelectorAll(
                        "[data-widget-id]"
                    );

                if (
                    widgets.length === 0
                ) {
                    return false;
                }

                layout.forEach(
                    id => {
                        const widget =
                            grid.querySelector(
                                `[data-widget-id="${id}"]`
                            );

                        if (
                            widget
                        ) {
                            grid.appendChild(
                                widget
                            );
                        }
                    }
                );

                return true;
            };

        if (
            !attemptReorder()
        ) {
            const observer =
                new MutationObserver(
                    () => {
                        if (
                            attemptReorder()
                        ) {
                            observer.disconnect();
                        }
                    }
                );

            observer.observe(
                grid,
                {
                    childList:
                        true
                }
            );

            setTimeout(
                () =>
                    observer.disconnect(),
                5000
            );
        }
    } catch (error) {
        console.error(error);

        localStorage.removeItem(
            STORAGE_KEY
        );
    }
}

export function resetLayout() {
    localStorage.removeItem(
        STORAGE_KEY
    );
}