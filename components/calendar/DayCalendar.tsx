"use client";

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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

    return (
        <div className="w-full h-full relative bg-black flex flex-col overflow-hidden">
            {/* Mobile Barber Selector */}
            {isMobile && barbers.length > 1 && (
                <div className="flex items-center gap-2 p-2 overflow-x-auto bg-zinc-900/50 border-b border-white/5 shrink-0 no-scrollbar">
                    {barbers.map(barber => (
                        <button
                            key={barber.id}
                            onClick={() => setSelectedBarberId(barber.id)}
                            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-tighter whitespace-nowrap transition-all
                                ${selectedBarberId === barber.id
                                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                                    : 'bg-zinc-800 text-zinc-400'}`}
                        >
                            {barber.displayName}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-auto flex relative">
                <TimeColumn startHour={START_HOUR} endHour={END_HOUR} pixelsPerMinute={PIXELS_PER_MINUTE} />

                {/* Desktop View: All Barbers | Mobile View: Selected Barber */}
                <div className="flex relative flex-1 lg:min-w-max">
                    {(isMobile ? barbers.filter(b => b.id === selectedBarberId) : barbers).map(barber => (
                        <div key={barber.id} className="min-w-full lg:min-w-[220px] border-r border-white/5 bg-black">
                            {/* Header (Desktop only or sticky) */}
                            <div className="hidden lg:flex h-16 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] sticky top-0 z-10 text-[#D4AF37]">
                                <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[10px] border border-[#D4AF37]/20 ${barber.photoUrl ? '' : 'bg-zinc-800 text-zinc-500'}`}>
                                    {barber.photoUrl ? (
                                        <img src={barber.photoUrl} alt={barber.displayName} className="w-full h-full object-cover" />
                                    ) : (barber.displayName?.charAt(0))}
                                </div>
                                {barber.displayName}
                            </div>

                            <div className="relative" style={{ height: hoursLength * 60 * PIXELS_PER_MINUTE }}>
                                {/* Horizontal Guide Lines */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        backgroundSize: `100% ${60 * PIXELS_PER_MINUTE}px`,
                                        backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
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
                                        pending: "bg-zinc-800 border-zinc-700 text-zinc-300 border-l-4 border-l-amber-500",
                                        confirmed: "bg-[#D4AF37] border-[#AA8A1E] text-black shadow-xl shadow-[#D4AF37]/10",
                                        done: "bg-zinc-900 border-white/5 text-zinc-500 opacity-60",
                                        cancelled: "bg-red-500/10 border-red-500/20 text-red-400/40 line-through text-[9px]"
                                    };

                                    const s = statusStyles[appt.status as keyof typeof statusStyles] || statusStyles.pending;
                                    const timeStr = startAtDate.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

                                    return (
                                        <div
                                            key={appt.id}
                                            onClick={() => setSelectedAppt(appt)}
                                            className={`absolute w-[92%] left-[4%] rounded-xl border px-3 py-1.5 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-center ${s}`}
                                            style={{ top, height, zIndex: appt.status === 'cancelled' ? 5 : 10 }}
                                        >
                                            <div className="flex justify-between items-center gap-2">
                                                <div className="font-black truncate text-xs leading-none">{appt.clientName}</div>
                                                <div className="font-mono text-[9px] opacity-70 whitespace-nowrap leading-none">{timeStr}</div>
                                            </div>
                                            {height >= 45 && (
                                                <div className="truncate text-[9px] mt-1 font-bold uppercase tracking-tight opacity-80 leading-none">{appt.serviceName}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {barbers.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-zinc-600 w-full p-20">
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
