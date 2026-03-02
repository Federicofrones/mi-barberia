import React, { useState } from 'react';
import { Button, Select, Input } from '@/components/ui';

interface BottomSheetProps {
    appt: any;
    onClose: () => void;
    onRefresh: () => void;
}

export default function BottomSheet({ appt, onClose, onRefresh }: BottomSheetProps) {
    const [loading, setLoading] = useState(false);

    // Payment States
    const [method, setMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
    const [discount, setDiscount] = useState(0);
    const [tip, setTip] = useState(0);

    const startStr = appt.startAt?.toDate ? appt.startAt.toDate().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }) :
        new Date(appt.startAt._seconds * 1000).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

    const handleApprove = async (action: 'approve' | 'cancel') => {
        setLoading(true);
        await fetch('/api/admin/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appointmentId: appt.id, action })
        });
        onRefresh();
        onClose();
    };

    const handlePay = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/close-pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appointmentId: appt.id, method, discount, tip })
        });

        if (res.ok) {
            onRefresh();
            onClose();
        } else {
            const { error } = await res.json();
            alert(error);
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />
            <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-2xl shadow-2xl z-50 transform transition-transform slide-in-bottom max-h-[90vh] overflow-y-auto">

                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />

                <div className="px-6 pb-6 w-full max-w-lg mx-auto">
                    <h2 className="text-xl font-bold">{appt.clientName}</h2>
                    <p className="text-gray-500 mb-4">{appt.serviceName} ({appt.durationMin}m) - {startStr}</p>
                    <div className="bg-gray-50 p-3 rounded text-sm mb-6 flex justify-between">
                        <span className="font-medium">Barbero:</span> <span>{appt.barberName}</span>
                    </div>

                    <div className="space-y-4">
                        {appt.status === 'pending' && (
                            <>
                                <p className="text-sm font-medium text-yellow-600 mb-2">Este turno requiere aprobación.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="danger" onClick={() => handleApprove('cancel')} disabled={loading}>Rechazar</Button>
                                    <Button variant="primary" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove('approve')} disabled={loading}>Aprobar Turno</Button>
                                </div>
                            </>
                        )}

                        {appt.status === 'confirmed' && (
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="font-bold">Cerrar Turno y Cobrar</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select label="Método de Pago" value={method} onChange={(e: any) => setMethod(e.target.value)}>
                                        <option value="cash">Efectivo 💵</option>
                                        <option value="card">Tarjeta 💳</option>
                                        <option value="transfer">Transferencia 🏦</option>
                                    </Select>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Precio Base</label>
                                        <div className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-500 font-medium">
                                            ${appt.pricing.basePrice}
                                        </div>
                                    </div>
                                    <Input label="Propina Incluida ($)" type="number" min={0} value={tip} onChange={(e: any) => setTip(Number(e.target.value))} />
                                    <Input label="Descuento Comercial ($)" type="number" min={0} value={discount} onChange={(e: any) => setDiscount(Number(e.target.value))} />
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg mt-4 mb-4 flex justify-between items-center">
                                    <span className="text-blue-900 font-bold">Total a Cobrar Cliente:</span>
                                    <span className="text-2xl text-blue-700 font-black">${appt.pricing.basePrice - discount + tip}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="danger" onClick={() => handleApprove('cancel')} disabled={loading}>Anular Turno</Button>
                                    <Button variant="primary" className="bg-blue-600 hover:bg-blue-700" onClick={handlePay} disabled={loading}>Confirmar Pago</Button>
                                </div>
                            </div>
                        )}

                        {appt.status === 'done' && (
                            <div className="text-center p-6 bg-green-50 rounded text-green-700 font-medium">
                                Este turno ya fue cobrado y cerrado exitosamente.
                            </div>
                        )}

                        {appt.status === 'cancelled' && (
                            <div className="text-center p-6 bg-red-50 rounded text-red-700 font-medium">
                                Este turno se encuentra cancelado.
                            </div>
                        )}

                        <Button variant="outline" className="w-full mt-2" onClick={onClose}>Cerrar Panel</Button>
                    </div>
                </div>
            </div>
        </>
    );
}
