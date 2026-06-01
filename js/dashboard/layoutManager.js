const STORAGE_KEY = "syntra-dashboard-layout";

export function saveLayout() {
    const widgets = [...document.querySelectorAll(".widget")];
    const layout = widgets.map(widget => widget.dataset.widgetId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
}

export function loadLayout() {
    const savedLayout = localStorage.getItem(STORAGE_KEY);
    if (!savedLayout) return;

    const layout = JSON.parse(savedLayout);
    const grid = document.getElementById("dashboard-grid");
    if (!grid) return;

    const attemptReorder = () => {
        const existingWidgets = grid.querySelectorAll("[data-widget-id]");
        if (existingWidgets.length === 0) return false;

        layout.forEach(id => {
            const widget = grid.querySelector(`[data-widget-id="${id}"]`);
            if (widget) grid.appendChild(widget);
        });
        return true;
    };

    if (!attemptReorder()) {
        const observer = new MutationObserver(() => {
            if (attemptReorder()) observer.disconnect();
        });
        observer.observe(grid, { childList: true });
        setTimeout(() => observer.disconnect(), 5000);
    }
}

export function resetLayout() {
    localStorage.removeItem(STORAGE_KEY);
}