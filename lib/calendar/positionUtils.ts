export function getPosition(
    startMinutes: number,
    durationMinutes: number,
    startOfDayMinutes: number,
    pixelsPerMinute: number = 2
) {
    const top = Math.max(0, startMinutes - startOfDayMinutes) * pixelsPerMinute;
    const height = durationMinutes * pixelsPerMinute;
    return { top, height };
}
