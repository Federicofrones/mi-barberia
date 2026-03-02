import React from 'react';
import AppointmentCard from './AppointmentCard';

interface BarberColumnProps {
    barber: any;
    appointments: any[];
    startHour: number;
    pixelsPerMinute: number;
    onAppointmentClick: (appt: any) => void;
}

export default function BarberColumn({ barber, appointments, startHour, pixelsPerMinute, onAppointmentClick }: BarberColumnProps) {
    const startOfDayMinutes = startHour * 60;

    return (
        <div className="flex-1 min-w-[200px] border-r border-gray-200 relative bg-white">
            {/* Header */}
            <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center justify-center font-semibold text-sm sticky top-0 z-10">
                <span className="truncate px-2">{barber.displayName}</span>
            </div>

            {/* Grid Lines */}
            <div className="absolute inset-0 top-12 pointer-events-none" style={{ backgroundSize: `100% ${60 * pixelsPerMinute}px`, backgroundImage: 'linear-gradient(to bottom, transparent 1px, transparent 1px, transparent calc(100% - 1px), #f3f4f6 100%)' }}>
            </div>

            {/* Appointments */}
            <div className="relative w-full h-full mt-12">
                {appointments.map(appt => {
                    const startAtDate = appt.startAt?.toDate ? appt.startAt.toDate() : new Date(appt.startAt._seconds * 1000);
                    const startMinutes = startAtDate.getHours() * 60 + startAtDate.getMinutes();

                    const top = Math.max(0, startMinutes - startOfDayMinutes) * pixelsPerMinute;
                    const height = appt.durationMin * pixelsPerMinute;

                    return (
                        <AppointmentCard
                            key={appt.id}
                            appointment={appt}
                            top={top}
                            height={height}
                            onClick={() => onAppointmentClick(appt)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
