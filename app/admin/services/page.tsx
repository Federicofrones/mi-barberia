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
                    <h1 className="text-3xl font-black tracking-tight text-black flex items-center gap-3">
                        <Scissors className="w-8 h-8" />
                        Servicios y Precios
                    </h1>
                    <p className="text-gray-500 mt-1">Configura tu catálogo de cortes y tratamientos.</p>
                </div>
                <Button onClick={createNew} className="flex items-center gap-2 px-8 shadow-lg shadow-black/10">
                    <Plus className="w-4 h-4" />
                    Nuevo Servicio
                </Button>
            </div>

            {/* Editing/Creation Modal */}
            {editingService && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <Card className="w-full max-w-xl bg-white border-none shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Settings2 className="w-5 h-5 text-zinc-400" />
                                    {editingService.id ? 'Editar Servicio' : 'Nuevo Servicio'}
                                </h2>
                                <button onClick={() => setEditingService(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <XCircle className="w-6 h-6 text-gray-300" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="space-y-4">
                                    <Input
                                        label="Nombre del Servicio"
                                        placeholder="Ej. Corte Clásico + Barba"
                                        value={editingService.name}
                                        onChange={(e: any) => setEditingService({ ...editingService, name: e.target.value })}
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Input
                                                label="Precio al Cliente ($)"
                                                type="number"
                                                value={editingService.price}
                                                onChange={(e: any) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <Input
                                            label="Duración Base (min)"
                                            type="number"
                                            value={editingService.baseDurationMin}
                                            onChange={(e: any) => setEditingService({ ...editingService, baseDurationMin: Number(e.target.value) })}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Costo Insumos ($)"
                                            type="number"
                                            value={editingService.serviceCost}
                                            onChange={(e: any) => setEditingService({ ...editingService, serviceCost: Number(e.target.value) })}
                                            required
                                        />
                                        <Select
                                            label="Estado"
                                            value={editingService.isActive ? "true" : "false"}
                                            onChange={(e: any) => setEditingService({ ...editingService, isActive: e.target.value === "true" })}
                                        >
                                            <option value="true">Activo</option>
                                            <option value="false">Pausado</option>
                                        </Select>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-[10px] text-gray-500 font-medium">
                                    Nota: Los barberos pueden tener duraciones personalizadas para estos servicios configuradas en su perfil individual.
                                </div>

                                <div className="flex gap-3 justify-end pt-4 border-t">
                                    <Button type="button" variant="outline" onClick={() => setEditingService(null)} className="px-6">Cancelar</Button>
                                    <Button type="submit" className="px-10 bg-black text-white hover:bg-zinc-800">Guardar Servicio</Button>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            )}

            {/* Services Grid/List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-gray-100 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {services.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] mt-10 border-2 border-dashed border-gray-200">
                            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium font-bold">Aún no has creado servicios.</p>
                            <Button variant="outline" onClick={createNew} className="mt-4">Crear el primero</Button>
                        </div>
                    ) : services.map(s => (
                        <div
                            key={s.id}
                            onClick={() => edit(s)}
                            className={`group relative bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden ${!s.isActive && 'opacity-60 grayscale'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                        <Scissors className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg text-black">{s.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" />
                                            {s.baseDurationMin} minutos base
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-black tracking-tighter">${s.price}</p>
                                    <p className="text-[9px] text-green-600 font-bold uppercase">Precio Venta</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Insumos</span>
                                        <span className="text-xs font-bold text-gray-600">${s.serviceCost}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Utilidad Est.</span>
                                        <span className="text-xs font-bold text-zinc-900">${s.price - s.serviceCost}</span>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter
                                    ${s.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}>
                                    {s.isActive ? (
                                        <><CheckCircle2 className="w-3 h-3" /> Activo</>
                                    ) : (
                                        <><XCircle className="w-3 h-3" /> Pausado</>
                                    )}
                                </div>
                            </div>

                            {/* Edit Hint on Hover */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black text-white p-2 rounded-full">
                                    <PenTool className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
