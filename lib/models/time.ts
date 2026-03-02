import { DateTime } from 'luxon';
import { globalConfig } from '../config';

export function now(): DateTime {
    return DateTime.now().setZone(globalConfig.timezone);
}

export function toDateKey(date: DateTime): string {
    return date.toFormat("yyyy-MM-dd");
}

export function fromDateKey(dateKey: string): DateTime {
    return DateTime.fromFormat(dateKey, "yyyy-MM-dd", { zone: globalConfig.timezone });
}

export function parseTime(timeStr: string, date: DateTime): DateTime {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return date.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
}
