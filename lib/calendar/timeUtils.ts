import { DateTime } from 'luxon';

export function generateSlots(
    startObj: DateTime,
    endObj: DateTime,
    slotMinutes: number,
    serviceDuration: number,
    existingAppointments: { startTime: number; endTime: number }[],
    nowObj: DateTime,
    minNoticeMinutes: number
): DateTime[] {
    const slots: DateTime[] = [];

    // existing appointments mapped to luxon objects/minutes for comparison
    let curr = startObj;

    while (curr.plus({ minutes: serviceDuration }) <= endObj) {
        const slotStart = curr;
        const slotEnd = curr.plus({ minutes: serviceDuration });

        // Validate if slot is in the past or before minNotice
        const minStartAllowed = nowObj.plus({ minutes: minNoticeMinutes });

        if (slotStart < minStartAllowed) {
            curr = curr.plus({ minutes: slotMinutes });
            continue;
        }

        // Check overlaps
        const startMin = slotStart.hour * 60 + slotStart.minute;
        const endMin = slotEnd.hour * 60 + slotEnd.minute;

        let isAvailable = true;
        for (const app of existingAppointments) {
            if (startMin < app.endTime && endMin > app.startTime) {
                isAvailable = false;
                break;
            }
        }

        if (isAvailable) {
            slots.push(slotStart);
        }

        curr = curr.plus({ minutes: slotMinutes });
    }

    return slots;
}
