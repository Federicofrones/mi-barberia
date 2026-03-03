"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, Input } from '@/components/ui';
import DayCalendar from '@/components/calendar/DayCalendar';
import { Calendar as CalendarIcon, Scissors } from 'lucide-react';

export default function CalendarPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [barbers, setBarbers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [apptRes, barberRes] = await Promise.all([
                fetch(`/api/admin/appointments?dateKey=${date}`),
                fetch('/api/admin/barbers')
            ]);
            const appstData = await apptRes.json();
            const barbersData = await barberRes.json();

            setAppointments(appstData.appointments || []);
            setBarbers((barbersData.barbers || []).filter((b: any) => b.isActive));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-6 max-w-7xl h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#D4AF37] rounded-2xl shadow-xl shadow-[#D4AF37]/20">
                        <CalendarIcon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">Agenda Diaria</h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Control de Turnos</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Input
                        type="date"
                        value={date}
                        onChange={(e: any) => setDate(e.target.value)}
                        className="w-full md:w-auto min-w-[200px] bg-zinc-900 border-white/5"
                    />
                </div>
            </div>

            <Card className="flex-1 overflow-hidden p-0 flex flex-col border border-white/5 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl relative">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-600">
                        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                        <p className="font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">Sincronizando Agenda...</p>
                    </div>
                ) : (
                    <DayCalendar barbers={barbers} appointments={appointments} dateKey={date} onRefresh={fetchData} />
                )}
            </Card>
        </div>
    );
}
