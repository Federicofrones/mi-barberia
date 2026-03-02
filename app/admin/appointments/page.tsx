"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, Input, Button } from '@/components/ui';

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
        // Fallback for older data or different format
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Listado de Turnos</h1>
                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        value={date}
                        onChange={(e: any) => setDate(e.target.value)}
                        className="w-auto"
                    />
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="py-3 px-4 font-semibold text-gray-600">Hora</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Barbero</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Servicio</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Cliente</th>
                                <th className="py-3 px-4 font-semibold text-gray-600 text-right">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-400">Cargando turnos...</td></tr>
                            ) : appointments.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No hay turnos para esta fecha</td></tr>
                            ) : (
                                appointments.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-medium">{formatTime(a)}</td>
                                        <td className="py-3 px-4">{a.barberName}</td>
                                        <td className="py-3 px-4">{a.serviceName}</td>
                                        <td className="py-3 px-4">
                                            <div className="font-medium">{a.clientName}</div>
                                            <div className="text-xs text-gray-500">{a.clientPhone}</div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize
                                                ${a.status === 'done' ? 'bg-green-100 text-green-700' :
                                                    a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        a.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                            a.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
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
