"use client";

import { useEffect, useState } from 'react';
import { Card, Button, Input, Select } from '@/components/ui';
import Link from 'next/link';
import { User, Shield, Clock, TrendingUp, Settings2, Plus, Calendar, CheckCircle2, XCircle } from 'lucide-react';

export default function StaffPage() {
    const [barbers, setBarbers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<any>(null);

    const fetchBarbers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/barbers');
            const data = await res.json();
            setBarbers(data.barbers || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBarbers();
    }, []);

    const handleSave = async (e: any) => {
        e.preventDefault();
        const payload = { ...editing };

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
        <div className="space-y-8 max-w-6xl pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-black">Gestión de Staff</h1>
                    <p className="text-gray-500 mt-1">Administra tus profesionales, comisiones y agendas.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/staff/overrides"
                        className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-lg font-semibold text-sm hover:border-black transition-all shadow-sm"
                    >
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Excepciones (Días Libres)
                    </Link>
                    <Button onClick={createNew} className="flex items-center gap-2 px-6 shadow-lg shadow-black/10">
                        <Plus className="w-4 h-4" />
                        Nuevo Barbero
                    </Button>
                </div>
            </div>

            {/* Editing/Creation Form */}
            {editing && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl bg-white border-none shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="p-2">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Settings2 className="w-5 h-5 text-amber-500" />
                                    {editing.id ? 'Editar Perfil del Barbero' : 'Registrar Nuevo Barbero'}
                                </h2>
                                <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <XCircle className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Información Básica</h3>
                                        <Input
                                            label="Nombre del Barbero"
                                            placeholder="Ej. Juan 'The Barber' Pérez"
                                            value={editing.displayName}
                                            onChange={(e: any) => setEditing({ ...editing, displayName: e.target.value })}
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Orden (Posición)"
                                                type="number"
                                                value={editing.order}
                                                onChange={(e: any) => setEditing({ ...editing, order: Number(e.target.value) })}
                                                required
                                            />
                                            <Select
                                                label="Estado Actual"
                                                value={editing.isActive ? "true" : "false"}
                                                onChange={(e: any) => setEditing({ ...editing, isActive: e.target.value === "true" })}
                                            >
                                                <option value="true">🟢 Activo</option>
                                                <option value="false">🔴 Inactivo</option>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Esquema de Pagos</h3>
                                        <Select
                                            label="Modalidad"
                                            value={editing.commission.type}
                                            onChange={(e: any) => setEditing({ ...editing, commission: { ...editing.commission, type: e.target.value } })}
                                        >
                                            <option value="percentage">Porcentaje sobre Venta</option>
                                            <option value="fixed">Monto Fijo por Turno</option>
                                        </Select>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label={editing.commission.type === 'percentage' ? 'Porcentaje (%)' : 'Monto ($)'}
                                                type="number"
                                                value={editing.commission.value}
                                                onChange={(e: any) => setEditing({ ...editing, commission: { ...editing.commission, value: Number(e.target.value) } })}
                                                required
                                            />
                                            <Select
                                                label="Propinas"
                                                value={editing.commission.includeTips ? "true" : "false"}
                                                onChange={(e: any) => setEditing({ ...editing, commission: { ...editing.commission, includeTips: e.target.value === "true" } })}
                                            >
                                                <option value="true">Incluir en Reportes</option>
                                                <option value="false">Omitir de Reportes</option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 italic text-sm text-amber-800">
                                    Tip: Los horarios de trabajo se configuran por defecto al crear un barbero. Puedes ajustarlos manualmente en la base de datos si necesitas horarios cortados.
                                </div>

                                <div className="flex gap-3 justify-end pt-4 border-t sticky bottom-0 bg-white">
                                    <Button type="button" variant="outline" onClick={() => setEditing(null)} className="px-8 border-gray-200">Cerrar</Button>
                                    <Button type="submit" className="px-8 bg-black text-white hover:bg-zinc-800">Guardar Cambios</Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            {/* List Section */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {barbers.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No hay profesionales registrados todavía.</p>
                            <Button variant="outline" onClick={createNew} className="mt-4">Empezar ahora</Button>
                        </div>
                    ) : barbers.map(b => (
                        <div
                            key={b.id}
                            className={`group relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${!b.isActive && 'grayscale bg-gray-50/50'}`}
                        >
                            {/* Decorative Background */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-50 rounded-full group-hover:bg-amber-50 transition-colors duration-500" />

                            <div className="relative flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${b.isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {b.displayName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-black leading-tight">{b.displayName}</h3>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            {b.isActive ? (
                                                <span className="flex items-center gap-1 text-[10px] uppercase tracking-tighter font-extrabold text-green-600">
                                                    <CheckCircle2 className="w-3 h-3" /> Activo
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] uppercase tracking-tighter font-extrabold text-red-400">
                                                    <XCircle className="w-3 h-3" /> Inactivo
                                                </span>
                                            )}
                                            <span className="text-gray-300">•</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">Orden: #{b.order}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Comisión</p>
                                        <p className="text-black font-bold">
                                            {b.commission?.type === 'percentage' ? `${b.commission?.value}%` : `$${b.commission?.value}`}
                                            <span className="text-xs font-normal text-gray-500 ml-1">sobre el neto</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Disponibilidad</p>
                                        <p className="text-black font-bold">Lunes a Sábado</p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full rounded-xl border-gray-100 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300 py-3 font-bold text-xs uppercase"
                                onClick={() => setEditing({
                                    ...b,
                                    commission: b.commission || { type: 'percentage', value: 50, includeTips: true },
                                    workingHours: b.workingHours || {}
                                })}
                            >
                                <Settings2 className="w-4 h-4 mr-2" />
                                Gestionar Perfil
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
