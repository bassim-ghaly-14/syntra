const currencyFormatter = new Intl.NumberFormat(
    "en-US",
    {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }
);

export function formatCurrency(value) {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "$0";
    }

    return currencyFormatter.format(number);
}

export function formatNumber(value) {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "0";
    }

    return new Intl.NumberFormat(
        "en-US"
    ).format(number);
}

export function formatPercentage(value) {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "0%";
    }

    return `${number.toFixed(1)}%`;
}

export function formatDate(date) {
    const targetDate =
        date instanceof Date
            ? date
            : new Date(date);

    return targetDate.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
}