"use client";

import { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '@/components/ui';
import { Briefcase, Settings2, Plus, Clock, DollarSign, PenTool, CheckCircle2, XCircle, Trash2, Scissors } from 'lucide-react';

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState<any>(null);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/services');
            const data = await res.json();
            setServices(data.services || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSave = async (e: any) => {
        e.preventDefault();
        const res = await fetch('/api/admin/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingService)
        });

        if (res.ok) {
            setEditingService(null);
            fetchServices();
        } else {
            alert("Error al guardar el servicio");
        }
    };

    const edit = (s: any) => setEditingService({ ...s });
    const createNew = () => setEditingService({
        name: '', baseDurationMin: 30, price: 0, serviceCost: 0, isActive: true
    });

    return (
        <div className="space-y-8 max-w-5xl pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-4">
                        <div className="p-3 bg-[#D4AF37] rounded-2xl shadow-xl shadow-[#D4AF37]/20">
                            <Scissors className="w-8 h-8 text-black" />
                        </div>
                        Servicios & Precios
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium">Define los cortes y tratamientos de la casa.</p>
                </div>
                <Button onClick={createNew} className="flex items-center gap-2 px-10">
                    <Plus className="w-4 h-4" />
                    Nuevo Servicio
                </Button>
            </div>

            {/* Editing/Creation Modal */}
            {editingService && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <Card className="w-full max-w-xl bg-zinc-900 border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-300">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Settings2 className="w-6 h-6 text-[#D4AF37]" />
                                    {editingService.id ? 'Editar Servicio' : 'Nuevo Servicio'}
                                </h2>
                                <button onClick={() => setEditingService(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white">
                                    <XCircle className="w-8 h-8" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="space-y-6">
                                    <Input
                                        label="Nombre del Servicio"
                                        placeholder="Ej. Corte Clásico + Barba"
                                        value={editingService.name}
                                        onChange={(e: any) => setEditingService({ ...editingService, name: e.target.value })}
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-6">
                                        <Input
                                            label="Precio ($)"
                                            type="number"
                                            value={editingService.price}
                                            onChange={(e: any) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                                            required
                                        />
                                        <Input
                                            label="Duración (min)"
                                            type="number"
                                            value={editingService.baseDurationMin}
                                            onChange={(e: any) => setEditingService({ ...editingService, baseDurationMin: Number(e.target.value) })}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Input
                                            label="Insumos ($)"
                                            type="number"
                                            value={editingService.serviceCost}
                                            onChange={(e: any) => setEditingService({ ...editingService, serviceCost: Number(e.target.value) })}
                                            required
                                        />
                                        <Select
                                            label="Estatus"
                                            value={editingService.isActive ? "true" : "false"}
                                            onChange={(e: any) => setEditingService({ ...editingService, isActive: e.target.value === "true" })}
                                        >
                                            <option value="true" className="bg-zinc-900">Activo</option>
                                            <option value="false" className="bg-zinc-900">Pausado</option>
                                        </Select>
                                    </div>
                                </div>

                                <div className="bg-[#D4AF37]/5 p-6 rounded-[2rem] border border-[#D4AF37]/10 text-xs text-[#D4AF37] font-medium leading-relaxed">
                                    Nota: Los barberos pueden tener duraciones personalizadas para estos servicios configuradas en su perfil individual.
                                </div>

                                <div className="flex gap-4 justify-end pt-6 border-t border-white/5">
                                    <Button type="button" variant="outline" onClick={() => setEditingService(null)} className="px-10">Cancelar</Button>
                                    <Button type="submit" className="px-12 bg-[#D4AF37] text-black">Guardar Cambios</Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            {/* Services Grid/List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-zinc-900/50 rounded-[2.5rem] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {services.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-zinc-900/30 rounded-[3rem] border border-dashed border-white/5">
                            <Briefcase className="w-20 h-20 text-zinc-800 mx-auto mb-6" />
                            <p className="text-zinc-500 font-bold text-xl">Tu catálogo está vacío.</p>
                            <Button variant="outline" onClick={createNew} className="mt-6 max-w-xs mx-auto">Empezar ahora</Button>
                        </div>
                    ) : services.map(s => (
                        <div
                            key={s.id}
                            onClick={() => edit(s)}
                            className={`group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:bg-zinc-900 transition-all duration-500 cursor-pointer overflow-hidden ${!s.isActive && 'opacity-60 grayscale'}`}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-black border border-white/5 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500">
                                        <Scissors className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-2xl text-white tracking-tight">{s.name}</h3>
                                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {s.baseDurationMin} minutos base
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-white tracking-tighter">${s.price}</p>
                                    <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest">Publicado</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                                <div className="flex gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Costo</span>
                                        <span className="text-sm font-black text-zinc-400">${s.serviceCost}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1">Margen</span>
                                        <span className="text-sm font-black text-white">${s.price - s.serviceCost}</span>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                    ${s.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {s.isActive ? (
                                        <><CheckCircle2 className="w-3.5 h-3.5" /> Activo</>
                                    ) : (
                                        <><XCircle className="w-3.5 h-3.5" /> Pausado</>
                                    )}
                                </div>
                            </div>

                            {/* Edit Hint on Hover */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-[#D4AF37] text-black p-2.5 rounded-2xl shadow-xl">
                                    <PenTool className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
