import React, { useState } from 'react';
import { Button, Select, Input } from '@/components/ui';
import { Clock, Check, X, CreditCard, Banknote, Landmark, Trash2, Edit3 } from 'lucide-react';

interface BottomSheetProps {
    appt: any;
    onClose: () => void;
    onRefresh: () => void;
}

export default function BottomSheet({ appt, onClose, onRefresh }: BottomSheetProps) {
    const [loading, setLoading] = useState(false);
    const [isEditingDuration, setIsEditingDuration] = useState(false);
    const [customDuration, setCustomDuration] = useState(appt.durationMin);

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

    const handleUpdateDuration = async () => {
        setLoading(true);
        try {
            await fetch('/api/admin/appointment/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId: appt.id, durationMin: customDuration })
            });
            onRefresh();
            setIsEditingDuration(false);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
            <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-[2.5rem] shadow-2xl z-50 transform transition-transform slide-in-bottom max-h-[95vh] overflow-y-auto ring-1 ring-black/5">

                <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-6" />

                <div className="px-6 pb-12 w-full max-w-xl mx-auto">
                    {/* Header Info */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-black tracking-tight">{appt.clientName}</h2>
                            <div className="flex items-center gap-2 text-gray-400 font-medium mt-1">
                                <Clock className="w-4 h-4" />
                                <span>{startStr} • {appt.durationMin} min</span>
                                {!isEditingDuration && appt.status !== 'done' && appt.status !== 'cancelled' && (
                                    <button
                                        onClick={() => setIsEditingDuration(true)}
                                        className="text-amber-600 hover:text-amber-700 p-1 rounded-md hover:bg-amber-50"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className={`px-4 py-1 rounded-2xl text-[10px] uppercase font-black tracking-widest
                            ${appt.status === 'done' ? 'bg-green-100 text-green-700' :
                                appt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                    appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}
                        >
                            {appt.status}
                        </div>
                    </div>

                    {/* Quick Duration Edit */}
                    {isEditingDuration && (
                        <div className="bg-amber-50 p-4 rounded-3xl mb-6 border border-amber-100 animate-in fade-in slide-in-from-top-4">
                            <h4 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Ajustar duración para este turno
                            </h4>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    min={5}
                                    step={5}
                                    value={customDuration}
                                    onChange={(e: any) => setCustomDuration(Number(e.target.value))}
                                />
                                <Button onClick={handleUpdateDuration} disabled={loading} className="shrink-0 bg-amber-600 hover:bg-amber-700">
                                    <Check className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" onClick={() => setIsEditingDuration(false)} className="shrink-0">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-[10px] text-amber-700 mt-2 font-medium">Este cambio solo afecta a esta cita y estira el bloque en el calendario.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Servicio</p>
                            <p className="font-bold text-black">{appt.serviceName}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Profesional</p>
                            <p className="font-bold text-black">{appt.barberName}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {appt.status === 'pending' && (
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <Button variant="outline" className="border-red-100 text-red-600 hover:bg-red-50 py-4 h-auto rounded-2xl font-bold" onClick={() => handleApprove('cancel')} disabled={loading}>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Rechazar
                                </Button>
                                <Button className="bg-black text-white py-4 h-auto rounded-2xl font-black shadow-xl shadow-black/10" onClick={() => handleApprove('approve')} disabled={loading}>
                                    <Check className="w-4 h-4 mr-2" />
                                    Aprobar
                                </Button>
                            </div>
                        )}

                        {appt.status === 'confirmed' && (
                            <div className="space-y-6 pt-4 border-t">
                                <h3 className="font-black text-lg tracking-tight">Cobrar Turno</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'cash', label: 'Efectivo', icon: Banknote, color: 'text-green-600' },
                                            { id: 'card', label: 'Tarjeta', icon: CreditCard, color: 'text-blue-600' },
                                            { id: 'transfer', label: 'Transf.', icon: Landmark, color: 'text-purple-600' }
                                        ].map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => setMethod(m.id as any)}
                                                className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all ${method === m.id ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`}
                                            >
                                                <m.icon className={`w-6 h-6 mb-2 ${method === m.id ? 'text-white' : m.color}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Propina ($)" type="number" min={0} value={tip} onChange={(e: any) => setTip(Number(e.target.value))} />
                                        <Input label="Descuento ($)" type="number" min={0} value={discount} onChange={(e: any) => setDiscount(Number(e.target.value))} />
                                    </div>

                                    <div className="bg-black rounded-3xl p-6 flex justify-between items-center shadow-2xl shadow-black/20">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Cliente</p>
                                            <p className="text-white text-4xl font-black tracking-tighter">${appt.pricing.basePrice - discount + tip}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-bold">Base: ${appt.pricing.basePrice}</p>
                                            {discount > 0 && <p className="text-[10px] text-red-400 font-bold">Desc: -${discount}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="text-red-500 py-3 rounded-2xl border-gray-100 hover:bg-red-50" onClick={() => handleApprove('cancel')} disabled={loading}>Anular</Button>
                                    <Button className="bg-black text-white py-3 rounded-2xl font-black" onClick={handlePay} disabled={loading}>Registrar Pago</Button>
                                </div>
                            </div>
                        )}

                        {(appt.status === 'done' || appt.status === 'cancelled') && (
                            <div className={`text-center p-10 rounded-[2rem] border mt-4 ${appt.status === 'done' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                                <h4 className="font-black text-lg mb-2 capitalize">{appt.status === 'done' ? '¡Cobrado!' : 'Cancelado'}</h4>
                                <p className="text-sm font-medium opacity-80">Este turno ya no puede ser modificado.</p>
                                <Button variant="outline" className="mt-6 w-full rounded-2xl border-gray-200" onClick={onClose}>Volver a la Agenda</Button>
                            </div>
                        )}

                        {appt.status !== 'done' && appt.status !== 'cancelled' && (
                            <Button variant="outline" className="w-full mt-2 rounded-2xl h-14 border-gray-100 font-bold text-gray-400" onClick={onClose}>Cerrar Panel</Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
