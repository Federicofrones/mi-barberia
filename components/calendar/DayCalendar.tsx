import React, { useState } from 'react';
import BarberColumn from './BarberColumn';
import TimeColumn from './TimeColumn';
import BottomSheet from './BottomSheet';

interface DayCalendarProps {
    barbers: any[];
    appointments: any[];
    dateKey: string;
    onRefresh: () => void;
}

export default function DayCalendar({ barbers, appointments, dateKey, onRefresh }: DayCalendarProps) {
    const [selectedAppt, setSelectedAppt] = useState<any>(null);

    // Configuration settings (could be passed from global)
    const START_HOUR = 8;
    const END_HOUR = 22;
    const PIXELS_PER_MINUTE = 2; // Adjusts vertical scale. 2px per minute = 120px per hour

    const hoursLength = END_HOUR - START_HOUR;

    return (
        <div className="w-full h-full relative border border-gray-200 bg-gray-100 rounded-md overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto flex relative">
                <TimeColumn startHour={START_HOUR} endHour={END_HOUR} pixelsPerMinute={PIXELS_PER_MINUTE} />

                <div className="flex relative min-w-max">
                    {barbers.map(barber => (
                        <div key={barber.id} className="min-w-[200px] border-r border-gray-200 bg-white">
                            {/* Header fixed via sticky parent or handled locally */}
                            <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center justify-center font-semibold text-sm sticky top-0 z-10 w-[200px]">
                                <span className="truncate px-2">{barber.displayName}</span>
                            </div>

                            <div className="relative" style={{ height: hoursLength * 60 * PIXELS_PER_MINUTE }}>
                                {/* Horizontal Guide Lines */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundSize: `100% ${60 * PIXELS_PER_MINUTE}px`,
                                        backgroundImage: 'linear-gradient(to bottom, transparent 1px, transparent 1px, transparent calc(100% - 1px), #f3f4f6 100%)'
                                    }}
                                />

                                {/* Appointments for this barber */}
                                {appointments.filter(a => a.barberId === barber.id).map(appt => {
                                    const startAtDate = appt.startAt?.toDate ? appt.startAt.toDate() : new Date(appt.startAt._seconds * 1000);
                                    const startMinutes = startAtDate.getHours() * 60 + startAtDate.getMinutes();

                                    const startOfDayMinutes = START_HOUR * 60;
                                    const top = Math.max(0, startMinutes - startOfDayMinutes) * PIXELS_PER_MINUTE;
                                    const height = appt.durationMin * PIXELS_PER_MINUTE;

                                    const statusStyles = {
                                        pending: "bg-yellow-100 border-yellow-300 text-yellow-900",
                                        confirmed: "bg-blue-100 border-blue-300 text-blue-900 border-l-4 border-l-blue-500",
                                        done: "bg-green-100 border-green-300 text-green-900 opacity-80",
                                        cancelled: "bg-red-50 border-red-200 text-red-500 line-through opacity-50 text-xs"
                                    };

                                    const s = statusStyles[appt.status as keyof typeof statusStyles] || statusStyles.pending;
                                    const timeStr = startAtDate.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <div
                                            key={appt.id}
                                            onClick={() => setSelectedAppt(appt)}
                                            className={`absolute w-[94%] left-[3%] rounded border p-1.5 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow text-xs ${s}`}
                                            style={{ top, height, zIndex: appt.status === 'cancelled' ? 5 : 10 }}
                                        >
                                            <div className="font-bold truncate">{timeStr} - {appt.clientName}</div>
                                            <div className="truncate text-[10px] mt-0.5 opacity-80">{appt.serviceName}</div>
                                            {height > 40 && appt.status !== 'cancelled' && (
                                                <div className="hidden sm:block truncate text-[10px] mt-1 font-mono">{appt.clientPhone}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {barbers.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-gray-400 w-full p-20">
                            No hay barberos activos configurados.
                        </div>
                    )}
                </div>
            </div>

            {selectedAppt && (
                <BottomSheet
                    appt={selectedAppt}
                    onClose={() => setSelectedAppt(null)}
                    onRefresh={onRefresh}
                />
            )}
        </div>
    );
}
