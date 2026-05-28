export function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === "string") {
        return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (
        typeof value === "object" &&
        !Array.isArray(value)
    ) {
        return Object.keys(value).length === 0;
    }

    return false;
}

export function isNumber(value) {
    return (
        typeof value === "number" &&
        Number.isFinite(value)
    );
}

export function isPositiveNumber(value) {
    return (
        isNumber(value) &&
        value > 0
    );
}

export function isValidEmail(email) {
    if (typeof email !== "string") {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
}