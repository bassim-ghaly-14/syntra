let modalElement = null;

function createModalElement() {
    const modal = document.createElement("div");

    modal.id = "syntra-modal";

    modal.innerHTML = `
        <div class="syntra-modal-overlay"></div>

        <div class="syntra-modal-window">
            <div class="syntra-modal-header">
                <h3 id="syntra-modal-title">Notification</h3>

                <button
                    id="syntra-modal-close"
                    class="syntra-modal-close"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>

            <div
                id="syntra-modal-body"
                class="syntra-modal-body"
            ></div>

            <div class="syntra-modal-footer">
                <button
                    id="syntra-modal-confirm"
                    class="syntra-modal-btn"
                >
                    Confirm
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeButton =
        document.getElementById("syntra-modal-close");

    const overlay =
        modal.querySelector(".syntra-modal-overlay");

    const confirmButton =
        document.getElementById("syntra-modal-confirm");

    closeButton.addEventListener("click", closeModal);

    overlay.addEventListener("click", closeModal);

    confirmButton.addEventListener("click", closeModal);

    return modal;
}

function getModal() {
    if (!modalElement) {
        modalElement = createModalElement();
    }

    return modalElement;
}

export function openModal({
    title = "Notification",
    content = "",
    confirmText = "Confirm",
    onConfirm = null
} = {}) {
    const modal = getModal();

    const titleElement =
        document.getElementById("syntra-modal-title");

    const bodyElement =
        document.getElementById("syntra-modal-body");

    const confirmButton =
        document.getElementById("syntra-modal-confirm");

    titleElement.textContent = title;

    bodyElement.innerHTML = content;

    confirmButton.textContent = confirmText;

    const newButton = confirmButton.cloneNode(true);

    confirmButton.parentNode.replaceChild(
        newButton,
        confirmButton
    );

    newButton.addEventListener("click", () => {
        if (typeof onConfirm === "function") {
            onConfirm();
        }

        closeModal();
    });

    modal.classList.add("active");
}

export function closeModal() {
    const modal = getModal();

    modal.classList.remove("active");
}

export function showInfoModal(
    title,
    message
) {
    openModal({
        title,
        content: `<p>${message}</p>`,
        confirmText: "Close"
    });
}

export function showErrorModal(
    message
) {
    openModal({
        title: "Error",
        content: `<p>${message}</p>`,
        confirmText: "Close"
    });
}

export function showSuccessModal(
    message
) {
    openModal({
        title: "Success",
        content: `<p>${message}</p>`,
        confirmText: "Done"
    });
}