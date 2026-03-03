"use client";

import { useEffect, useState } from 'react';
import { Card, Button, Input, Select } from '@/components/ui';
import Link from 'next/link';
import { User, Shield, Clock, TrendingUp, Settings2, Plus, Calendar, CheckCircle2, XCircle, Scissors } from 'lucide-react';

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
            photoUrl: '',
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
                    <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
                        <Scissors className="w-10 h-10 text-[#D4AF37]" />
                        Staff de Barberos
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">Administra a tus artistas y sus comisiones.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/admin/staff/overrides"
                        className="flex items-center gap-2 border border-white/10 bg-zinc-900 px-6 py-3 rounded-2xl font-bold text-sm text-zinc-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all shadow-xl"
                    >
                        <Calendar className="w-4 h-4" />
                        Días Libres
                    </Link>
                    <Button onClick={createNew} className="flex items-center gap-2 px-8">
                        <Plus className="w-4 h-4" />
                        Nuevo Barbero
                    </Button>
                </div>
            </div>

            {/* Editing/Creation Form */}
            {editing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl bg-zinc-900 border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 md:p-10">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                                    {editing.id ? 'Ficha de Barbero' : 'Nuevo Registro Elite'}
                                </h2>
                                <button
                                    onClick={() => setEditing(null)}
                                    className="p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-full transition-all text-zinc-500 hover:text-white"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-10 pb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] inline-flex items-center gap-2">
                                            <div className="w-1 h-3 bg-[#D4AF37] rounded-full" />
                                            Perfil Público
                                        </h3>
                                        <Input
                                            label="Nombre Artístico"
                                            placeholder="Ej. Tony 'Blade' Romano"
                                            value={editing.displayName}
                                            onChange={(e: any) => setEditing({ ...editing, displayName: e.target.value })}
                                            required
                                        />
                                        <Input
                                            label="Imagen (URL)"
                                            placeholder="https://..."
                                            value={editing.photoUrl || ''}
                                            onChange={(e: any) => setEditing({ ...editing, photoUrl: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Orden en Lista"
                                                type="number"
                                                value={editing.order}
                                                onChange={(e: any) => setEditing({ ...editing, order: Number(e.target.value) })}
                                                required
                                            />
                                            <Select
                                                label="Estatus"
                                                value={editing.isActive ? "true" : "false"}
                                                onChange={(e: any) => setEditing({ ...editing, isActive: e.target.value === "true" })}
                                            >
                                                <option value="true" className="bg-zinc-900">Activo</option>
                                                <option value="false" className="bg-zinc-900">Inactivo</option>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] inline-flex items-center gap-2">
                                            <div className="w-1 h-3 bg-[#D4AF37] rounded-full" />
                                            Finanzas & Comisión
                                        </h3>
                                        <Select
                                            label="Tipo de Pago"
                                            value={editing.commission.type}
                                            onChange={(e: any) => setEditing({ ...editing, commission: { ...editing.commission, type: e.target.value } })}
                                        >
                                            <option value="percentage" className="bg-zinc-900">Porcentaje (%)</option>
                                            <option value="fixed" className="bg-zinc-900">Monto Fijo ($)</option>
                                        </Select>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Valor"
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
                                                <option value="true" className="bg-zinc-900">Trakear</option>
                                                <option value="false" className="bg-zinc-900">Privado</option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#D4AF37]/5 p-6 rounded-[2rem] border border-[#D4AF37]/10 flex items-start gap-4 shadow-inner">
                                    <div className="p-2.5 bg-[#D4AF37] rounded-[1rem] shadow-lg shadow-[#D4AF37]/20">
                                        <Shield className="w-5 h-5 text-black" />
                                    </div>
                                    <p className="text-[11px] text-[#D4AF37] font-bold leading-relaxed uppercase tracking-wider">
                                        El horario de trabajo y bloqueos de agenda se gestionan <br /> automáticamente desde la configuración global.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditing(null)}
                                        className="py-5 border-zinc-800 text-zinc-500 hover:text-white"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="py-5 bg-[#D4AF37] text-black font-black uppercase text-xs tracking-widest shadow-2xl shadow-[#D4AF37]/20"
                                    >
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            {/* List Section */}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-zinc-900/50 rounded-[2.5rem] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {barbers.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-zinc-900/30 rounded-[3rem] border border-dashed border-white/5">
                            <User className="w-20 h-20 text-zinc-800 mx-auto mb-6" />
                            <p className="text-zinc-500 font-bold text-xl">Sin barberos en el equipo.</p>
                            <Button variant="outline" onClick={createNew} className="mt-6 max-w-xs mx-auto">Agregar primero</Button>
                        </div>
                    ) : barbers.map(b => (
                        <div
                            key={b.id}
                            className={`group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:bg-zinc-900 transition-all duration-500 overflow-hidden ${!b.isActive && 'grayscale opacity-40'}`}
                        >
                            {/* Accent Light */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#D4AF37]/10 transition-colors" />

                            <div className="relative flex justify-between items-start mb-8">
                                <div className="flex items-center gap-5">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-2xl overflow-hidden ${b.isActive ? 'bg-[#D4AF37] text-black shadow-[#D4AF37]/20' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {b.photoUrl ? (
                                            <img src={b.photoUrl} alt={b.displayName} className="w-full h-full object-cover" />
                                        ) : b.displayName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl text-white leading-tight tracking-tight">{b.displayName}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            {b.isShiftActive ? (
                                                <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg shadow-[#D4AF37]/5">
                                                    <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" /> Disponible
                                                </span>
                                            ) : b.isActive ? (
                                                <span className="px-3 py-1 bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" /> Fuera de Turno
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                                                    <XCircle className="w-3 h-3" /> Offline
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-black/30 p-4 rounded-3xl border border-white/5">
                                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-[#D4AF37]" /> Comisión
                                    </p>
                                    <p className="text-white font-black text-lg">
                                        {b.commission?.type === 'percentage' ? `${b.commission?.value}%` : `$${b.commission?.value}`}
                                    </p>
                                </div>
                                <div className="bg-black/30 p-4 rounded-3xl border border-white/5">
                                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-[#D4AF37]" /> Rango
                                    </p>
                                    <p className="text-white font-black text-lg">Master</p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full bg-zinc-950/50 border-white/5 group-hover:bg-[#D4AF37] group-hover:text-black group-hover:border-[#D4AF37] group-hover:shadow-xl group-hover:shadow-[#D4AF37]/20 transition-all duration-500 py-4 font-black text-[10px] uppercase tracking-[0.2em]"
                                onClick={() => setEditing({
                                    ...b,
                                    commission: b.commission || { type: 'percentage', value: 50, includeTips: true },
                                    workingHours: b.workingHours || {}
                                })}
                            >
                                <Settings2 className="w-4 h-4 mr-1" />
                                Editar Perfil
                            </Button>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}
