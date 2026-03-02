"use client";

import { useEffect, useState } from 'react';
import { Card, Input } from '@/components/ui';

export default function DashboardPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [stats, setStats] = useState<any>(null);
    const [barberStats, setBarberStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAllStats = async () => {
            setLoading(true);
            try {
                const [dailyRes, barberRes] = await Promise.all([
                    fetch(`/api/admin/daily-stats?dateKey=${date}`),
                    fetch(`/api/admin/barber-stats?dateKey=${date}`)
                ]);

                const dailyData = await dailyRes.json();
                const barberData = await barberRes.json();

                setStats(dailyData.stats);
                setBarberStats(barberData.stats);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAllStats();
    }, [date]);

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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

                    {barberStats.length === 0 ? (
                        <p className="text-gray-500">No hay métricas de barberos para la fecha solicitada.</p>
                    ) : (
                        <Card className="overflow-hidden p-0 border-gray-200">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-gray-50">
                                    <tr className="border-b">
                                        <th className="py-3 px-4 font-semibold text-gray-600">Barbero</th>
                                        <th className="py-3 px-4 font-semibold text-gray-600 text-right">Turnos</th>
                                        <th className="py-3 px-4 font-semibold text-gray-600 text-right">Generado (Neto)</th>
                                        <th className="py-3 px-4 font-semibold text-gray-600 text-right">Comisión a Pagar</th>
                                        <th className="py-3 px-4 font-semibold text-gray-600 text-right" title="Porcentaje que trajo frente al total de hoy">% Revenue</th>
                                        <th className="py-3 px-4 font-semibold text-gray-600 text-right text-green-700 bg-green-50 border-l" title="Ganancia libre que dejó este barbero al negocio">Profit Real</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {barberStats.map(b => {
                                        const revPct = stats?.revenue?.net > 0 ? ((b.revenueNet / stats.revenue.net) * 100).toFixed(1) : 0;

                                        return (
                                            <tr key={b.barberId} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4 font-medium">{b.barberName}</td>
                                                <td className="py-3 px-4 text-right">{b.doneCount}</td>
                                                <td className="py-3 px-4 text-right">${b.revenueNet}</td>
                                                <td className="py-3 px-4 text-right font-medium text-amber-700">${b.commissionTotal}</td>
                                                <td className="py-3 px-4 text-right font-medium text-gray-500">{revPct}%</td>
                                                <td className="py-3 px-4 text-right font-bold text-green-700 bg-green-50 border-l">${b.profitNet}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
