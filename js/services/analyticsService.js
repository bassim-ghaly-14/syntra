export function calculateGrowth(current, previous) {
    const currentValue = Number(current);
    const previousValue = Number(previous);
    
    if (Number.isNaN(currentValue) || Number.isNaN(previousValue)) return 0;
    if (previousValue === 0) return currentValue === 0 ? 0 : 100;
    
    return ((currentValue - previousValue) / previousValue) * 100;
}

export function calculateAverage(values = []) {
    if (!Array.isArray(values) || values.length === 0) return 0;
    
    const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
    return total / values.length;
}

export function calculateTotal(values = []) {
    if (!Array.isArray(values)) return 0;
    return values.reduce((sum, value) => sum + Number(value || 0), 0);
}

export function calculateTrend(current, previous) {
    const growth = calculateGrowth(current, previous);
    const threshold = 0.1;
    
    if (growth > threshold) return "up";
    if (growth < -threshold) return "down";
    return "flat";
}