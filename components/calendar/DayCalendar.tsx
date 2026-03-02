import React, { useState, useEffect } from 'react';
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
    const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

    useEffect(() => {
        if (barbers.length > 0 && !selectedBarberId) {
            setSelectedBarberId(barbers[0].id);
        }
    }, [barbers, selectedBarberId]);

    // Configuration
    const START_HOUR = 8;
    const END_HOUR = 22;
    const PIXELS_PER_MINUTE = 2;
    const hoursLength = END_HOUR - START_HOUR;

    const visibleBarbers = barbers.filter(b => selectedBarberId ? b.id === selectedBarberId : true);

    return (
        <div className="w-full h-full relative bg-gray-50 flex flex-col overflow-hidden">
            {/* Mobile Barber Selector */}
            <div className="lg:hidden flex items-center gap-2 p-2 overflow-x-auto bg-white border-b border-gray-100 shrink-0 no-scrollbar">
                {barbers.map(barber => (
                    <button
                        key={barber.id}
                        onClick={() => setSelectedBarberId(barber.id)}
                        className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-tighter whitespace-nowrap transition-all
                            ${selectedBarberId === barber.id ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}
                    >
                        {barber.displayName}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-auto flex relative">
                <TimeColumn startHour={START_HOUR} endHour={END_HOUR} pixelsPerMinute={PIXELS_PER_MINUTE} />

                {/* Desktop View: All Barbers | Mobile View: Selected Barber */}
                <div className="flex relative flex-1 lg:min-w-max">
                    {(window.innerWidth < 1024 ? visibleBarbers : barbers).map(barber => (
                        <div key={barber.id} className="min-w-full lg:min-w-[220px] border-r border-gray-100 bg-white">
                            {/* Header (Desktop only or sticky) */}
                            <div className="hidden lg:flex h-12 border-b border-gray-100 bg-gray-50/50 backdrop-blur-md items-center justify-center font-black text-[10px] uppercase tracking-widest sticky top-0 z-10">
                                {barber.displayName}
                            </div>

                            <div className="relative" style={{ height: hoursLength * 60 * PIXELS_PER_MINUTE }}>
                                {/* Horizontal Guide Lines */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundSize: `100% ${60 * PIXELS_PER_MINUTE}px`,
                                        backgroundImage: 'linear-gradient(to bottom, #f9fafb 1px, transparent 1px)'
                                    }}
                                />

                                {/* Appointments */}
                                {appointments.filter(a => a.barberId === barber.id).map(appt => {
                                    const startAtDate = appt.startAt?.toDate ? appt.startAt.toDate() : new Date((appt.startAt._seconds || appt.startAt.seconds) * 1000);
                                    const startMinutes = startAtDate.getHours() * 60 + startAtDate.getMinutes();

                                    const startOfDayMinutes = START_HOUR * 60;
                                    const top = Math.max(0, startMinutes - startOfDayMinutes) * PIXELS_PER_MINUTE;
                                    const height = (appt.durationMin || 30) * PIXELS_PER_MINUTE;

                                    const statusStyles = {
                                        pending: "bg-amber-50 border-amber-200 text-amber-900 border-l-4 border-l-amber-500",
                                        confirmed: "bg-zinc-900 border-zinc-800 text-white shadow-xl",
                                        done: "bg-gray-100 border-gray-200 text-gray-400 opacity-60",
                                        cancelled: "bg-red-50 border-red-100 text-red-300 line-through opacity-40 text-[9px]"
                                    };

                                    const s = statusStyles[appt.status as keyof typeof statusStyles] || statusStyles.pending;
                                    const timeStr = startAtDate.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <div
                                            key={appt.id}
                                            onClick={() => setSelectedAppt(appt)}
                                            className={`absolute w-[92%] left-[4%] rounded-2xl border p-2.5 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${s}`}
                                            style={{ top, height, zIndex: appt.status === 'cancelled' ? 5 : 10 }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="font-black truncate text-xs">{appt.clientName}</div>
                                                <div className="font-mono text-[9px] opacity-70">{timeStr}</div>
                                            </div>
                                            {height > 50 && (
                                                <div className="truncate text-[9px] mt-1 font-bold uppercase tracking-tight opacity-80">{appt.serviceName}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {barbers.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-gray-400 w-full p-20">
                            No hay profesionales activos.
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
