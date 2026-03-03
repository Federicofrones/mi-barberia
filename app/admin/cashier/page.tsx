"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, DollarSign, Calendar } from 'lucide-react';

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
        <div className="space-y-8 max-w-5xl pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#D4AF37] rounded-2xl shadow-xl shadow-[#D4AF37]/20">
                        <Wallet className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">Cajón Diario</h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Reporte de Caja</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-zinc-900/50 rounded-[2.5rem] animate-pulse" />)}
                </div>
            ) : !stats ? (
                <Card className="py-20 text-center border-dashed border-white/5">
                    <DollarSign className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-500 font-bold">No hay movimientos registrados para esta fecha.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Cash Card */}
                    <Card className="bg-[#D4AF37] border-none text-black relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                            <Wallet className="w-20 h-20" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-black/50 mb-1">Caja (Efectivo)</h3>
                        <p className="text-4xl font-black tracking-tighter">${stats.paymentMethods?.cash || 0}</p>
                        <div className="mt-6 pt-6 border-t border-black/10 text-[10px] font-bold space-y-2 opacity-70">
                            <div className="flex justify-between">
                                <span>Transferencias</span>
                                <span>${stats.paymentMethods?.transfer || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tarjetas</span>
                                <span>${stats.paymentMethods?.card || 0}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Breakdown Card */}
                    <Card className="col-span-1 md:col-span-2 space-y-8 bg-zinc-900/40 border-white/5">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-[0.2em]">Desglose Operativo</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Ingresos Netos</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-2xl font-black text-white">${stats.revenue?.net || 0}</p>
                                    <span className="text-[10px] text-zinc-500">(Sin Propinas)</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Propinas</p>
                                <p className="text-2xl font-black text-[#D4AF37]">+ ${stats.revenue?.tips || 0}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                                <p className="text-[9px] font-black text-red-500/50 uppercase tracking-widest mb-1">Pagos Staff</p>
                                <p className="text-lg font-black text-red-400">- ${stats.commissions?.total || 0}</p>
                            </div>
                            <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                                <p className="text-[9px] font-black text-red-500/50 uppercase tracking-widest mb-1">Costo Insumos</p>
                                <p className="text-lg font-black text-red-400">- ${stats.costs?.services || 0}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Profit Card */}
                    <div className="col-span-1 md:col-span-3">
                        <Card className="bg-zinc-900 border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
                                <div>
                                    <h3 className="text-sm font-black text-[#D4AF37] uppercase tracking-[0.3em]">Utilidad Final del Negocio</h3>
                                    <p className="text-xs text-zinc-500 mt-2 font-medium">Margen real luego de costos y comisiones operativas.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-5xl font-black text-white tracking-tighter">${stats.profit?.net || 0}</p>
                                        <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mt-1">Superávit Confirmado</p>
                                    </div>
                                    <div className="p-4 bg-[#D4AF37] rounded-3xl shadow-2xl shadow-[#D4AF37]/20">
                                        <ArrowUpCircle className="w-8 h-8 text-black" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
