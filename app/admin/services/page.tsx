"use client";

import { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '@/components/ui';

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingService, setEditingService] = useState<any>(null);

    const fetchServices = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/services');
        const data = await res.json();
        setServices(data.services || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSave = async (e: any) => {
        e.preventDefault();
        await fetch('/api/admin/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingService)
        });
        setEditingService(null);
        fetchServices();
    };

    const edit = (s: any) => setEditingService({ ...s });
    const createNew = () => setEditingService({
        name: '', baseDurationMin: 30, price: 0, serviceCost: 0, isActive: true
    });

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Servicios</h1>
                <Button onClick={createNew} className="max-w-xs">+ Nuevo Servicio</Button>
            </div>

            {editingService && (
                <Card className="mb-6">
                    <form onSubmit={handleSave} className="space-y-4">
                        <h2 className="text-lg font-medium">{editingService.id ? 'Editar' : 'Nuevo'}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Nombre" value={editingService.name} onChange={(e: any) => setEditingService({ ...editingService, name: e.target.value })} required />
                            <Input label="Duración base (min) (Se puede sobrescribir por barbero)" type="number" value={editingService.baseDurationMin} onChange={(e: any) => setEditingService({ ...editingService, baseDurationMin: Number(e.target.value) })} required />
                            <Input label="Precio" type="number" value={editingService.price} onChange={(e: any) => setEditingService({ ...editingService, price: Number(e.target.value) })} required />
                            <Input label="Costo del servicio (Insumos, no comisiones)" type="number" value={editingService.serviceCost} onChange={(e: any) => setEditingService({ ...editingService, serviceCost: Number(e.target.value) })} required />
                            <Select label="Estado" value={editingService.isActive ? "true" : "false"} onChange={(e: any) => setEditingService({ ...editingService, isActive: e.target.value === "true" })}>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setEditingService(null)}>Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card>
                {loading ? <p>Cargando...</p> : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Nombre</th>
                                <th className="py-2">Duración Base</th>
                                <th className="py-2">Precio</th>
                                <th className="py-2">Costo (Insumos)</th>
                                <th className="py-2">Estado</th>
                                <th className="py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(s => (
                                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50 h-12">
                                    <td className="font-medium">{s.name}</td>
                                    <td>{s.baseDurationMin} min</td>
                                    <td>${s.price}</td>
                                    <td>${s.serviceCost}</td>
                                    <td>
                                        <span className={`px-2 py-1 text-xs rounded-full ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {s.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <Button variant="outline" className="text-xs py-1 px-2" onClick={() => edit(s)}>Editar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
}
