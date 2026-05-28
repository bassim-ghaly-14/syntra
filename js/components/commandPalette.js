export function initializeCommandPalette() {

    document.addEventListener("keydown", event => {

        if (event.ctrlKey && event.key === "k") {

            event.preventDefault();

            console.log("command palette");

        }

    });

}
