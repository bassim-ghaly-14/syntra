import { createSafeElement } from "../utils/sanitizer.js";

let modalElement = null;
let focusedElementBeforeModal = null;

function createModalElement() {
    const modal = document.createElement("div");

    modal.id = "syntra-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "syntra-modal-title");

    modal.innerHTML = `
        <div class="syntra-modal-overlay"></div>

        <div class="syntra-modal-window">
            <div class="syntra-modal-header">
                <h3 id="syntra-modal-title">Notification</h3>

                <button
                    id="syntra-modal-close"
                    class="syntra-modal-close"
                    aria-label="Close dialog"
                    type="button"
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
                    type="button"
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

    // Handle Escape key
    const handleEscapeKey = (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    };

    return { modal, handleEscapeKey };
}

function getModal() {
    if (!modalElement) {
        const result = createModalElement();
        modalElement = result.modal;
        modalElement._handleEscapeKey = result.handleEscapeKey;
    }

    return modalElement;
}

function trapFocus(event) {
    const modal = getModal();
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
        }
    }
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

    // SECURITY FIX: Use safe text content instead of innerHTML
    bodyElement.innerHTML = "";
    
    // Parse and safely insert content
    if (typeof content === 'string') {
        // If content looks like HTML, create safe elements
        if (content.includes('<')) {
            bodyElement.textContent = content;
        } else {
            bodyElement.textContent = content;
        }
    } else {
        bodyElement.textContent = String(content);
    }

    confirmButton.textContent = confirmText;

    const newButton = confirmButton.cloneNode(true);

    confirmButton.parentNode.replaceChild(
        newButton,
        confirmButton
    );

    newButton.addEventListener("click", () => {
        if (typeof onConfirm === "function") {
            try {
                onConfirm();
            } catch (error) {
                console.error("Modal confirm callback error:", error);
            }
        }

        closeModal();
    });

    // Focus management - store element that triggered modal
    focusedElementBeforeModal = document.activeElement;

    modal.classList.add("active");

    // Focus first button
    const firstButton = modal.querySelector("button");
    if (firstButton) {
        setTimeout(() => firstButton.focus(), 100);
    }

    // Trap focus within modal
    document.addEventListener("keydown", trapFocus);
    document.addEventListener("keydown", modal._handleEscapeKey);
}

export function closeModal() {
    const modal = getModal();

    modal.classList.remove("active");

    // Remove event listeners
    document.removeEventListener("keydown", trapFocus);
    if (modal._handleEscapeKey) {
        document.removeEventListener("keydown", modal._handleEscapeKey);
    }

    // Restore focus
    if (focusedElementBeforeModal && typeof focusedElementBeforeModal.focus === "function") {
        focusedElementBeforeModal.focus();
    }
}

export function showInfoModal(
    title,
    message
) {
    openModal({
        title,
        content: message,
        confirmText: "Close"
    });
}

export function showErrorModal(
    message
) {
    openModal({
        title: "Error",
        content: message,
        confirmText: "Close"
    });
}

export function showSuccessModal(
    message
) {
    openModal({
        title: "Success",
        content: message,
        confirmText: "Done"
    });
}
