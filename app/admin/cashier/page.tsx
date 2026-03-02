"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input } from '@/components/ui';

export default function CashierPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        const res = await fetch(`/api/admin/daily-stats?dateKey=${date}`);
        const data = await res.json();
        setStats(data.stats);
        setLoading(false);
    }, [date]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Cajón Diario</h1>
                <div className="flex items-center gap-2">
                    <Input type="date" value={date} onChange={(e: any) => setDate(e.target.value)} />
                </div>
            </div>

            {loading ? <p>Cargando...</p> : (
                !stats ? <Card><p className="py-4 text-center text-gray-500">No hay movimientos registrados en caja para esta fecha.</p></Card> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <Card className="bg-gray-900 border-none text-white">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Caja (Efectivo) Prevista</h3>
                            <p className="text-3xl font-bold">${stats.paymentMethods?.cash || 0}</p>
                            <div className="mt-4 text-xs space-y-1 text-gray-300">
                                <p>Transferencias: ${stats.paymentMethods?.transfer || 0}</p>
                                <p>Tarjetas: ${stats.paymentMethods?.card || 0}</p>
                            </div>
                        </Card>

                        <Card className="col-span-1 md:col-span-2 space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 border-b pb-2">Desglose Bruto</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Ingresos Brutos Reales (Sin Tip)</p>
                                    <p className="text-xl font-bold">${stats.revenue?.net || 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Propinas Recibidas</p>
                                    <p className="text-xl font-bold text-green-600">+ ${stats.revenue?.tips || 0}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Egresos: Pago a Profesionales</p>
                                    <p className="text-xl font-bold text-red-500">- ${stats.commissions?.total || 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Egresos: Insumos o Servicios Base</p>
                                    <p className="text-xl font-bold text-red-500">- ${stats.costs?.services || 0}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Negocio Neto */}
                        <div className="col-span-1 md:col-span-3">
                            <Card className="bg-green-50 border-green-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide">Ganancia Neta del Negocio Libre (Profit)</h3>
                                        <p className="text-xs text-green-600 mt-1">Luego de pagar profesionales e insumos previstos</p>
                                    </div>
                                    <p className="text-4xl font-black text-green-600">${stats.profit?.net || 0}</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
