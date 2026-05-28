let toastContainer = null;

function createToastContainer() {
    const container = document.createElement("div");

    container.id = "syntra-toast-container";

    document.body.appendChild(container);

    return container;
}

function getToastContainer() {
    if (!toastContainer) {
        toastContainer = createToastContainer();
    }

    return toastContainer;
}

export function showToast(
    message,
    type = "info",
    duration = 4000
) {
    const container =
        getToastContainer();

    const toast =
        document.createElement("div");

    toast.className =
        `syntra-toast syntra-toast-${type}`;

    toast.innerHTML = `
        <span>${message}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 250);
    }, duration);
}

export function showSuccessToast(
    message
) {
    showToast(message, "success");
}

export function showErrorToast(
    message
) {
    showToast(message, "error");
}

export function showWarningToast(
    message
) {
    showToast(message, "warning");
}

export function showInfoToast(
    message
) {
    showToast(message, "info");
}