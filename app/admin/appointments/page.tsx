"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, Input, Button } from '@/components/ui';
import { Calendar, User, Scissors, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function AppointmentsPage() {
    const [date, setDate] = useState("");
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Set local date as default
        setDate(new Date().toISOString().split('T')[0]);
    }, []);

    const fetchAppointments = useCallback(async () => {
        if (!date) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/appointments?dateKey=${date}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            // Client side sorting to avoid Firestore Index requirement for now
            const sorted = (data.appointments || []).sort((a: any, b: any) => {
                const timeA = a.startTime || "";
                const timeB = b.startTime || "";
                return timeA.localeCompare(timeB);
            });

            setAppointments(sorted);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    if (!mounted) return null;

    const formatTime = (a: any) => {
        if (a.startTime) return a.startTime;
        if (a.startAt) {
            try {
                if (a.startAt._seconds) return new Date(a.startAt._seconds * 1000).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
                if (a.startAt.toDate) return a.startAt.toDate().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
            } catch (e) {
                return "--:--";
            }
        }
        return "--:--";
    };

    return (
        <div className="space-y-8 max-w-6xl pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#D4AF37] rounded-2xl shadow-xl shadow-[#D4AF37]/20">
                        <FileText className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">Listado de Turnos</h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Registros Históricos</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Input
                        type="date"
                        value={date}
                        onChange={(e: any) => setDate(e.target.value)}
                        className="w-full md:w-auto min-w-[200px]"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-zinc-900/50 rounded-[2.5rem] animate-pulse" />
                    ))}
                </div>
            ) : appointments.length === 0 ? (
                <Card className="py-32 text-center border-dashed border-white/5 bg-zinc-900/20">
                    <div className="flex flex-col items-center gap-6">
                        <div className="p-5 bg-zinc-800/50 rounded-full">
                            <Calendar className="w-12 h-12 text-zinc-600" />
                        </div>
                        <div>
                            <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-sm">Silencio en la Barbería</p>
                            <p className="text-zinc-700 text-xs font-bold mt-2">No hay turnos registrados para esta fecha.</p>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map(a => {
                        const statusColors = {
                            done: { bg: 'bg-zinc-900', text: 'text-zinc-500', accent: 'bg-[#D4AF37]' },
                            pending: { bg: 'bg-amber-500/10', text: 'text-amber-500', accent: 'bg-amber-500' },
                            cancelled: { bg: 'bg-red-500/10', text: 'text-red-500', accent: 'bg-red-500' },
                            confirmed: { bg: 'bg-[#D4AF37]/10', text: 'text-[#D4AF37]', accent: 'bg-[#D4AF37]' }
                        };
                        const config = statusColors[a.status as keyof typeof statusColors] || statusColors.pending;

                        return (
                            <div
                                key={a.id}
                                className={`group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 transition-all duration-500 hover:bg-zinc-900 hover:scale-[1.02] shadow-2xl overflow-hidden ${a.status === 'cancelled' ? 'opacity-50 grayscale' : ''}`}
                            >
                                {/* Time Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-black rounded-2xl border border-white/5 shadow-inner">
                                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                                        <span className="font-black text-white text-xs">{formatTime(a)}</span>
                                    </div>
                                    <div className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl ${config.bg} ${config.text} border border-current opacity-80`}>
                                        {a.status || 'pendiente'}
                                    </div>
                                </div>

                                {/* Service Info */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${config.accent} text-black shadow-lg shadow-black/20`}>
                                            <Scissors className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-white leading-none capitalize group-hover:text-[#D4AF37] transition-colors">
                                                {a.serviceName}
                                            </h3>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                                                <User className="w-3 h-3" /> Con {a.barberName}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Client Details */}
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-black text-xs text-zinc-400">
                                            {a.clientName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-zinc-200">{a.clientName}</p>
                                            <p className="text-[10px] font-bold text-zinc-600 tracking-wider font-mono">{a.clientPhone}</p>
                                        </div>
                                    </div>

                                    {a.status === 'confirmed' && (
                                        <div className="p-2.5 bg-green-500/10 text-green-500 rounded-xl">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>

                                {/* Decorative Gradient */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#D4AF37]/10 transition-colors duration-700" />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
