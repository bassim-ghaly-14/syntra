let loaderElement = null;

function createLoader() {
    const wrapper =
        document.createElement("div");

    wrapper.id = "syntra-loader";

    wrapper.innerHTML = `
        <div class="syntra-loader-backdrop">
            <div class="syntra-loader-spinner"></div>
        </div>
    `;

    document.body.appendChild(wrapper);

    return wrapper;
}

function getLoader() {
    if (!loaderElement) {
        loaderElement = createLoader();
    }

    return loaderElement;
}

export function showLoader() {
    const loader = getLoader();

    loader.style.display = "block";

    requestAnimationFrame(() => {
        loader.classList.add("active");
    });
}

export function hideLoader() {
    const loader = getLoader();

    loader.classList.remove("active");

    setTimeout(() => {
        loader.style.display = "none";
    }, 200);
}

export async function withLoader(callback) {
    try {
        showLoader();

        return await callback();
    } finally {
        hideLoader();
    }
}