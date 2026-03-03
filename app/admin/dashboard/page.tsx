"use client";

import { useEffect, useState } from 'react';
import { Card, Input } from '@/components/ui';

export default function DashboardPage() {
    const [date, setDate] = useState("");
    const [stats, setStats] = useState<any>(null);
    const [barberStats, setBarberStats] = useState<any[]>([]);
    const [barberInfos, setBarberInfos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setDate(new Date().toISOString().split('T')[0]);
    }, []);

    useEffect(() => {
        if (!date) return;

        const fetchAllStats = async () => {
            setLoading(true);
            try {
                const [dailyRes, barberRes] = await Promise.all([
                    fetch(`/api/admin/daily-stats?dateKey=${date}`),
                    fetch(`/api/admin/barber-stats?dateKey=${date}`)
                ]);

                if (!dailyRes.ok || !barberRes.ok) {
                    console.error("Failed to fetch stats");
                    return;
                }

                const dailyData = await dailyRes.json();
                const barberData = await barberRes.json();

                // Join with barber info for photos
                const barbersRes = await fetch('/api/admin/barbers');
                const barbersData = await barbersRes.json();
                setBarberInfos(barbersData.barbers || []);

                setStats(dailyData?.stats || null);
                setBarberStats(barberData?.stats || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAllStats();
    }, [date]);

    if (!mounted) return null;

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Métricas y Participación</h1>
                <div className="flex items-center gap-2">
                    <Input type="date" value={date} onChange={(e: any) => setDate(e.target.value)} />
                </div>
            </div>

            {loading ? <p>Generando reporte...</p> : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <h3 className="text-xs text-gray-500 font-medium">Turnos Completados</h3>
                            <p className="text-2xl font-bold">{stats?.appointments?.done || 0}</p>
                        </Card>
                        <Card>
                            <h3 className="text-xs text-gray-500 font-medium">Facturación Neta</h3>
                            <p className="text-2xl font-bold">${stats?.revenue?.net || 0}</p>
                        </Card>
                        <Card>
                            <h3 className="text-xs text-gray-500 font-medium">Pago a Profesionales</h3>
                            <p className="text-2xl font-bold text-red-500">-${stats?.commissions?.total || 0}</p>
                        </Card>
                        <Card>
                            <h3 className="text-xs text-gray-500 font-medium">Rentabilidad (Profit)</h3>
                            <p className="text-2xl font-bold text-green-600">${stats?.profit?.net || 0}</p>
                        </Card>
                    </div>

                    <h2 className="text-xl font-bold mt-10 mb-4">Participación por Barbero</h2>

                    {(!barberStats || barberStats.length === 0) ? (
                        <p className="text-gray-500">No hay métricas de barberos para la fecha solicitada.</p>
                    ) : (
                        <Card className="p-0 border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                                    <thead className="bg-gray-50">
                                        <tr className="border-b">
                                            <th className="py-3 px-4 font-semibold text-gray-600">Barbero</th>
                                            <th className="py-3 px-4 font-semibold text-gray-600 text-right">Turnos</th>
                                            <th className="py-3 px-4 font-semibold text-gray-600 text-right">Generado (Neto)</th>
                                            <th className="py-3 px-4 font-semibold text-gray-600 text-right">Comisión a Pagar</th>
                                            <th className="py-3 px-4 font-semibold text-gray-600 text-right">% Revenue</th>
                                            <th className="py-3 px-4 font-semibold text-gray-600 text-right text-green-700 bg-green-50 border-l">Profit Real</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {barberStats.map((b, idx) => {
                                            const totalRevenue = stats?.revenue?.net || 0;
                                            const revPct = totalRevenue > 0 ? ((b.revenueNet / totalRevenue) * 100).toFixed(1) : "0";
                                            const info = barberInfos.find(bi => bi.id === b.barberId);

                                            return (
                                                <tr key={b.barberId || `idx-${idx}`} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4 font-medium flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-black shrink-0 ${info?.photoUrl ? '' : 'bg-gray-200 text-gray-500'}`}>
                                                            {info?.photoUrl ? (
                                                                <img src={info.photoUrl} alt={b.barberName} className="w-full h-full object-cover" />
                                                            ) : (b.barberName?.charAt(0))}
                                                        </div>
                                                        {b.barberName || 'Desconocido'}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">{b.doneCount || 0}</td>
                                                    <td className="py-3 px-4 text-right">${b.revenueNet || 0}</td>
                                                    <td className="py-3 px-4 text-right font-medium text-amber-700">${b.commissionTotal || 0}</td>
                                                    <td className="py-3 px-4 text-right font-medium text-gray-500">{revPct}%</td>
                                                    <td className="py-3 px-4 text-right font-bold text-green-700 bg-green-50 border-l">${b.profitNet || 0}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
