"use client";

import { useEffect, useState } from 'react';
import { Card, Button, Input } from '@/components/ui';

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
            await fetch('/api/admin/overrides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: barberId, overrides: barber.serviceOverrides || {} })
            });
            alert('Excepciones guardadas exitosamente.');
        } catch (e) {
            alert('Error guardando');
        }
    };

    if (loading) return <p>Cargando configuraciones...</p>;

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Excepciones por Barbero</h1>
            </div>
            <p className="text-gray-500 mb-6 text-sm">Modifica el tiempo que cada barbero se demora en un servicio. Si dejas el campo en blanco, se usará el tiempo base del servicio.</p>

            {barbers.map(barber => (
                <Card key={barber.id} className="mb-4">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                        <h2 className="text-lg font-bold">{barber.displayName}</h2>
                        <Button className="max-w-[150px] text-xs py-1" onClick={() => handleSave(barber.id)}>
                            Guardar para {barber.displayName.split(' ')[0]}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map(srv => {
                            const currentOverride = barber.serviceOverrides?.[srv.id]?.durationMin || '';
                            return (
                                <div key={srv.id} className="p-3 bg-gray-50 rounded-md border border-gray-100 flex justify-between items-center">
                                    <div className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium pr-2 text-gray-700" title={srv.name}>
                                        {srv.name}
                                        <div className="text-xs text-gray-400 font-normal mt-0.5">Base: {srv.baseDurationMin}m</div>
                                    </div>
                                    <div className="w-1/2">
                                        <input
                                            type="number"
                                            placeholder="min"
                                            value={currentOverride}
                                            className="w-full border-gray-300 rounded focus:ring-black focus:border-black text-sm py-1.5 px-2 text-center"
                                            onChange={(e) => handleOverrideChange(barber.id, srv.id, e.target.value)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            ))}

        </div>
    );
}
