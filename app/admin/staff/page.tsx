"use client";

import { useEffect, useState } from 'react';
import { Card, Button, Input, Select } from '@/components/ui';
import Link from 'next/link';

export default function StaffPage() {
    const [barbers, setBarbers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<any>(null);

    const fetchBarbers = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/barbers');
        const data = await res.json();
        setBarbers(data.barbers || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchBarbers();
    }, []);

    const handleSave = async (e: any) => {
        e.preventDefault();
        const payload = {
            ...editing,
            // Default working hours empty string mapped to null logic
        };

        const res = await fetch('/api/admin/barber', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();

        if (res.ok) {
            setEditing(null);
            fetchBarbers();
        } else {
            alert(result.error);
        }
    };

    const createNew = () => {
        setEditing({
            displayName: '',
            isActive: true,
            order: barbers.length + 1,
            commission: { type: 'percentage', value: 50, includeTips: true },
            workingHours: {
                mon: { start: '09:00', end: '18:00' },
                tue: { start: '09:00', end: '18:00' },
                wed: { start: '09:00', end: '18:00' },
                thu: { start: '09:00', end: '18:00' },
                fri: { start: '09:00', end: '18:00' },
                sat: { start: '09:00', end: '14:00' },
                sun: null
            }
        });
    };

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Barberos (Staff)</h1>
                <div className="flex gap-2">
                    <Link href="/admin/staff/overrides" className="border border-gray-300 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-50">Configurar Excepciones</Link>
                    <Button onClick={createNew}>+ Nuevo Barbero</Button>
                </div>
            </div>

            {editing && (
                <Card className="mb-6 border-black shadow-lg">
                    <h2 className="text-lg font-bold mb-4">{editing.id ? 'Editar Barbero' : 'Nuevo Barbero'}</h2>
                    <form onSubmit={handleSave} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input label="Nombre Visible" value={editing.displayName} onChange={(e: any) => setEditing({ ...editing, displayName: e.target.value })} required />
                            <Input label="Orden en Calendario" type="number" value={editing.order} onChange={(e: any) => setEditing({ ...editing, order: Number(e.target.value) })} required />
                            <Select label="Estado (Max 6 activos)" value={editing.isActive ? "true" : "false"} onChange={(e: any) => setEditing({ ...editing, isActive: e.target.value === "true" })}>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </Select>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-2">Comisiones</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Select label="Tipo de Comisión" value={editing.commission.type} onChange={(e: any) => setEditing({ ...editing, commission: { ...editing.commission, type: e.target.value } })}>
                                    <option value="percentage">Porcentaje (%)</option>
                                    <option value="fixed">Monto Fijo ($)</option>
                                </Select>
                                <Input label="Valor" type="number" value={editing.commission.value} onChange={(e: any) => setEditing({ ...editing, commission: { ...editing.commission, value: Number(e.target.value) } })} required />
                                <Select label="¿Incluye propinas?" value={editing.commission.includeTips ? "true" : "false"} onChange={(e: any) => setEditing({ ...editing, commission: { ...editing.commission, includeTips: e.target.value === "true" } })}>
                                    <option value="true">Sí</option>
                                    <option value="false">No</option>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
                            <Button type="submit">Guardar Cambios</Button>
                        </div>
                    </form>
                </Card>
            )}

            {loading ? <p>Cargando staff...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {barbers.map(b => (
                        <Card key={b.id} className={`${!b.isActive && 'opacity-60 bg-gray-50'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{b.displayName}</h3>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${b.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {b.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                Comisión: {b.commission?.type === 'percentage' ? `${b.commission?.value}%` : `$${b.commission?.value} fijo`} {b.commission?.includeTips && '+ tip'}
                            </p>
                            <Button variant="outline" className="text-sm py-1.5" onClick={() => setEditing({
                                ...b,
                                commission: b.commission || { type: 'percentage', value: 50, includeTips: true },
                                workingHours: b.workingHours || {}
                            })}>Editar Perfil</Button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
