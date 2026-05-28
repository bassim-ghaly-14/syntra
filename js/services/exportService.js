import {
    showSuccessModal,
    showErrorModal
} from "../components/modal.js";

export function exportJSON(
    data,
    fileName = "syntra-export"
) {
    try {
        const content =
            JSON.stringify(
                data,
                null,
                2
            );

        const blob =
            new Blob(
                [content],
                {
                    type: "application/json"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            `${fileName}.json`;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );

        showSuccessModal(
            "Export completed successfully."
        );
    } catch (error) {
        console.error(error);

        showErrorModal(
            "Failed to export data."
        );
    }
}