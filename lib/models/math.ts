export function round(value: number, precision: number = 2): number {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}

export function calculateCommission(
    basePrice: number,
    discount: number = 0,
    tip: number = 0,
    commissionOptions: { type: "percentage" | "fixed"; value: number; includeTips: boolean }
) {
    const finalPrice = basePrice - discount;
    const commissionBase = finalPrice + (commissionOptions.includeTips ? tip : 0);

    let commissionAmount = 0;
    if (commissionOptions.type === "percentage") {
        commissionAmount = round(commissionBase * (commissionOptions.value / 100));
    } else {
        commissionAmount = Math.min(commissionOptions.value, commissionBase);
    }

    return {
        finalPrice,
        commissionBase,
        commissionAmount
    };
}
