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
        console.error("Layout save error:", error);
    }
}

export async function loadLayout() {
    try {
        const savedLayout =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!savedLayout) {
            return;
        }

        let layout;
        try {
            layout = JSON.parse(savedLayout);
        } catch (error) {
            console.warn("Invalid layout data, clearing:", error);
            localStorage.removeItem(STORAGE_KEY);
            return;
        }

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

        // Use Promise-based approach instead of MutationObserver timeout
        const attemptReorder = () => {
            try {
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
            } catch (error) {
                console.error("Layout reorder error:", error);
                return false;
            }
        };

        // Try immediate reorder first
        if (attemptReorder()) {
            return;
        }

        // If widgets not ready, wait for them with timeout
        return new Promise((resolve) => {
            const observer =
                new MutationObserver(
                    () => {
                        if (
                            attemptReorder()
                        ) {
                            observer.disconnect();
                            resolve();
                        }
                    }
                );

            observer.observe(
                grid,
                {
                    childList: true
                }
            );

            // Timeout with error handling
            setTimeout(
                () => {
                    observer.disconnect();
                    const success = attemptReorder();
                    if (!success) {
                        console.warn("Layout restoration timeout - using default layout");
                    }
                    resolve();
                },
                5000
            );
        });
    } catch (error) {
        console.error("Layout load error:", error);

        try {
            localStorage.removeItem(
                STORAGE_KEY
            );
        } catch (clearError) {
            console.error("Failed to clear layout:", clearError);
        }
    }
}

export function resetLayout() {
    try {
        localStorage.removeItem(
            STORAGE_KEY
        );
    } catch (error) {
        console.error("Layout reset error:", error);
    }
}
