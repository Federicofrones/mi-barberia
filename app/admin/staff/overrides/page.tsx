"use client";

import { useEffect, useState } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Clock, User, Scissors, Save, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function OverridesPage() {
    const [barbers, setBarbers] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [bRes, sRes] = await Promise.all([
                fetch('/api/admin/barbers'),
                fetch('/api/admin/services')
            ]);
            const [bData, sData] = await Promise.all([bRes.json(), sRes.json()]);

            setBarbers(bData.barbers || []);
            setServices(sData.services || []);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleOverrideChange = (barberId: string, serviceId: string, duration: string) => {
        const updated = [...barbers];
        const barber = updated.find(b => b.id === barberId);

        if (!barber.serviceOverrides) barber.serviceOverrides = {};

        if (duration) {
            barber.serviceOverrides[serviceId] = { durationMin: parseInt(duration) };
        } else {
            delete barber.serviceOverrides[serviceId];
        }

        setBarbers(updated);
    };

    const handleSave = async (barberId: string) => {
        const barber = barbers.find(b => b.id === barberId);
        try {
            const res = await fetch('/api/admin/overrides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: barberId, overrides: barber.serviceOverrides || {} })
            });
            if (res.ok) {
                // Flash success or something
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 max-w-6xl pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/staff" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                        <ChevronLeft className="w-6 h-6 text-zinc-500" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">Excepciones de Tiempo</h1>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Configuración Individual</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#D4AF37]/5 p-6 rounded-[2rem] border border-[#D4AF37]/10 flex items-start gap-4 mb-8">
                <div className="p-2 bg-[#D4AF37] rounded-xl shrink-0">
                    <Clock className="w-5 h-5 text-black" />
                </div>
                <p className="text-sm text-[#D4AF37] font-medium leading-relaxed">
                    Personaliza cuánto tiempo toma cada barbero para cada servicio. Si dejas el campo vacío, se usará el tiempo estándar del catálogo.
                </p>
            </div>

            <div className="space-y-12">
                {barbers.map(barber => (
                    <div key={barber.id} className="relative">
                        <div className="flex items-center justify-between mb-6 px-4">
                            <h2 className="text-xl font-black text-white flex items-center gap-3">
                                <User className="w-5 h-5 text-[#D4AF37]" />
                                {barber.displayName}
                            </h2>
                            <Button className="max-w-[200px] text-[10px] uppercase tracking-widest py-3 h-auto" onClick={() => handleSave(barber.id)}>
                                <Save className="w-3.5 h-3.5 mr-2" />
                                Guardar {barber.displayName.split(' ')[0]}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map(srv => {
                                const currentOverride = barber.serviceOverrides?.[srv.id]?.durationMin || '';
                                return (
                                    <div key={srv.id} className="p-5 bg-zinc-900/40 border border-white/5 rounded-3xl flex justify-between items-center group hover:bg-zinc-900 transition-all">
                                        <div className="w-1/2 pr-2">
                                            <p className="text-sm font-bold text-zinc-300 truncate" title={srv.name}>{srv.name}</p>
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Base: {srv.baseDurationMin}m</p>
                                        </div>
                                        <div className="w-1/3 relative">
                                            <input
                                                type="number"
                                                placeholder="min"
                                                value={currentOverride}
                                                className="w-full bg-black border border-white/10 rounded-xl focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 text-sm py-2 px-3 text-center text-white outline-none transition-all"
                                                onChange={(e) => handleOverrideChange(barber.id, srv.id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
