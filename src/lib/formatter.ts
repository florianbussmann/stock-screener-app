export const formatPercent = (value: number) => formatChange(value) + " %";
export const formatChange = (value: number) =>
    (value > 0 ? "+" : "") +
    new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
