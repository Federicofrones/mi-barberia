"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, Input } from '@/components/ui';
import DayCalendar from '@/components/calendar/DayCalendar';
import { Calendar as CalendarIcon, Scissors, User, DollarSign, CheckCircle, Award } from 'lucide-react';

export default function BarberDashboard() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [me, setMe] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Get my identity
            const meRes = await fetch('/api/auth/me');
            const meData = await meRes.json();
            setMe(meData.user);

            if (meData.user?.barberId || meData.user?.role === 'admin') {
                const bId = meData.user.barberId;

                // 2. Get my appointments
                const apptRes = await fetch(`/api/barber/appointments?dateKey=${date}`);
                const apptData = await apptRes.json();
                setAppointments(apptData.appointments || []);

                // 3. Get my stats
                const statsRes = await fetch(`/api/barber/stats?dateKey=${date}`);
                const statsData = await statsRes.json();
                setStats(statsData.stats);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const barberData = me && me.barberId ? [{ id: me.barberId, displayName: "Mi Agenda" }] : [];

    return (
        <div className="space-y-6 max-w-7xl h-full flex flex-col pb-10">
            {/* Header / Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 border border-white/5 rounded-2xl">
                        <User className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Mi Trabajo</h1>
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Portal de Barbero Elite</p>
                    </div>
                </div>
                <Input
                    type="date"
                    value={date}
                    onChange={(e: any) => setDate(e.target.value)}
                    className="w-full md:w-auto min-w-[200px]"
                />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-zinc-900/40 border-white/5 p-5 flex flex-col justify-between hover:border-[#D4AF37]/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Servicios</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white">{stats?.doneCount || 0}</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Completados</p>
                    </div>
                </Card>

                <Card className="bg-zinc-900/40 border-white/5 p-5 flex flex-col justify-between hover:border-[#D4AF37]/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Producción</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white">${(stats?.revenueNet || 0).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total Generado</p>
                    </div>
                </Card>

                <Card className="bg-[#D4AF37]/5 border-[#D4AF37]/20 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <Award className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-[8px] font-black text-[#D4AF37]/40 uppercase tracking-widest">Mi Parte</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#D4AF37]">${(stats?.commissionTotal || 0).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-[#D4AF37]/60 uppercase tracking-widest">Comisión Estimada</p>
                    </div>
                </Card>

                <Card className="bg-zinc-900/40 border-white/5 p-5 flex flex-col justify-between hover:border-[#D4AF37]/20 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Propinas</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white">${(stats?.tips || 0).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Extra del día</p>
                    </div>
                </Card>
            </div>

            {/* Main Calendar Card */}
            <Card className="flex-1 min-h-[500px] overflow-hidden p-0 flex flex-col border border-white/5 bg-zinc-900/40 rounded-[2.5rem] relative">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#D4AF37]/10 border-t-[#D4AF37] rounded-full animate-spin" />
                        <p className="font-black text-[9px] uppercase tracking-widest text-zinc-600 animate-pulse">Sincronizando Agenda...</p>
                    </div>
                ) : (
                    <DayCalendar
                        barbers={barberData}
                        appointments={appointments}
                        dateKey={date}
                        onRefresh={fetchData}
                    />
                )}
            </Card>

            <footer className="text-center">
                <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.5em]">
                    Focus on Quality • Excellence is mandatory
                </p>
            </footer>
        </div>
    );
}
