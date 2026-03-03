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

            <Card className="p-0 overflow-hidden bg-zinc-900/40 border border-white/5 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="py-6 px-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Hora</th>
                                <th className="py-6 px-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Servicio</th>
                                <th className="py-6 px-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Barbero</th>
                                <th className="py-6 px-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Cliente</th>
                                <th className="py-6 px-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] text-right">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-20 text-zinc-600 font-bold italic animate-pulse">Sincronizando base de datos...</td></tr>
                            ) : appointments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-32">
                                        <div className="flex flex-col items-center gap-4">
                                            <Calendar className="w-12 h-12 text-zinc-800" />
                                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No hay actividad para este día</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                appointments.map(a => (
                                    <tr key={a.id} className="hover:bg-white/5 transition-all duration-300 group">
                                        <td className="py-6 px-8 font-black text-white group-hover:text-[#D4AF37] transition-colors">{formatTime(a)}</td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                                                    <Scissors className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="font-bold text-zinc-300">{a.serviceName}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-2 text-zinc-400 font-medium">
                                                <User className="w-4 h-4 text-zinc-600" />
                                                {a.barberName}
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="font-black text-white">{a.clientName}</div>
                                            <div className="text-[10px] font-bold text-zinc-600 tracking-wider mt-1">{a.clientPhone}</div>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg
                                                ${a.status === 'done' ? 'bg-zinc-800 text-[#D4AF37] shadow-[#D4AF37]/5' :
                                                    a.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                        a.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                            a.status === 'confirmed' ? 'bg-[#D4AF37] text-black shadow-[#D4AF37]/20' : 'bg-zinc-800 text-zinc-500'}`}
                                            >
                                                {a.status || 'pendiente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
