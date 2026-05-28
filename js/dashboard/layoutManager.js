const STORAGE_KEY = "syntra-dashboard-layout";

export function saveLayout() {
    const widgets = [
        ...document.querySelectorAll(
            ".widget"
        )
    ];

    const layout = widgets.map(
        widget =>
            widget.dataset.widgetId
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(layout)
    );
}

export function loadLayout() {
    const savedLayout =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!savedLayout) {
        return;
    }

    const layout =
        JSON.parse(savedLayout);

    const grid =
        document.getElementById(
            "dashboard-grid"
        );

    if (!grid) {
        return;
    }

    layout.forEach(id => {
        const widget =
            document.querySelector(
                `[data-widget-id="${id}"]`
            );

        if (widget) {
            grid.appendChild(widget);
        }
    });
}

export function resetLayout() {
    localStorage.removeItem(
        STORAGE_KEY
    );
}