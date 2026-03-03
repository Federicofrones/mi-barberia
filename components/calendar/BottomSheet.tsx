"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { X, Clock, User, Scissors, Phone, CheckCircle2, DollarSign, Edit3 } from 'lucide-react';

interface BottomSheetProps {
    appt: any;
    onClose: () => void;
    onRefresh: () => void;
}

export default function BottomSheet({ appt, onClose, onRefresh }: BottomSheetProps) {
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [isEditingDuration, setIsEditingDuration] = useState(false);
    const [tempDuration, setTempDuration] = useState(appt.durationMin);

    const handleStatus = async (status: string) => {
        const res = await fetch('/api/admin/approve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appointmentId: appt.id, status })
        });
        if (res.ok) {
            onRefresh();
            onClose();
        }
    };

    const handleClose = async () => {
        const res = await fetch('/api/admin/close-pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                appointmentId: appt.id,
                paymentMethod: paymentMethod.toLowerCase(),
                tip: 0,
                discount: 0
            })
        });
        if (res.ok) {
            onRefresh();
            onClose();
        }
    };

    const updateDuration = async () => {
        const res = await fetch('/api/admin/appointment/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                appointmentId: appt.id,
                updates: { durationMin: tempDuration }
            })
        });
        if (res.ok) {
            setIsEditingDuration(false);
            onRefresh();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
            <div className={`
                relative w-full max-w-xl bg-zinc-900 border-t border-white/10 rounded-t-[3rem] p-6 pb-12 
                pointer-events-auto transition-transform duration-500 transform slide-in-bottom
            `}>
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">{appt.clientName}</h2>
                        <p className="text-[#D4AF37] font-bold text-sm flex items-center gap-1.5 mt-1">
                            <Scissors className="w-4 h-4" />
                            {appt.serviceName}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black uppercase text-zinc-500 tracking-widest">Estado</p>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full mt-1 inline-block
                            ${appt.status === 'confirmed' ? 'bg-[#D4AF37] text-black' : 'bg-red-500/10 text-red-500'}`}>
                            {appt.status}
                        </span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/40 p-4 rounded-3xl border border-white/5 group relative">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Duración
                        </p>
                        <div className="flex items-center gap-2">
                            {isEditingDuration ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={tempDuration}
                                        onChange={(e) => setTempDuration(Number(e.target.value))}
                                        className="w-16 bg-zinc-800 border border-[#D4AF37] rounded-lg px-2 py-1 text-sm text-white"
                                        autoFocus
                                    />
                                    <button onClick={updateDuration} className="p-1 text-green-500"><CheckCircle2 className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <>
                                    <p className="font-bold text-white">{appt.durationMin} min</p>
                                    <button onClick={() => { setIsEditingDuration(true); setTempDuration(appt.durationMin); }} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#D4AF37]">
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="bg-black/40 p-4 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> WhatsApp
                        </p>
                        <p className="font-bold text-white text-sm">{appt.clientPhone}</p>
                    </div>
                </div>

                {appt.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <Button variant="outline" onClick={() => handleStatus('cancelled')} className="border-red-500/30 text-red-500 hover:bg-red-500/10">Rechazar</Button>
                        <Button onClick={() => handleStatus('confirmed')} className="bg-[#D4AF37] text-black">Aceptar Turno</Button>
                    </div>
                )}

                {appt.status === 'confirmed' && (
                    <div className="space-y-4">
                        <div className="bg-[#D4AF37] p-6 rounded-[2.5rem] shadow-xl shadow-[#D4AF37]/10">
                            <p className="text-[10px] font-black uppercase text-black/50 tracking-widest mb-4">Finalizar y Cobrar</p>
                            <div className="flex gap-2">
                                {['Efectivo', 'Transferencia', 'Tarjeta'].map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setPaymentMethod(m)}
                                        className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all
                                            ${paymentMethod === m ? 'bg-black text-[#D4AF37]' : 'bg-black/10 text-black hover:bg-black/20'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                            <Button onClick={handleClose} className="mt-4 bg-black text-[#D4AF37] border-none shadow-none hover:bg-zinc-900">
                                Confirmar Pago y Cerrar
                            </Button>
                        </div>
                        <button onClick={() => handleStatus('cancelled')} className="w-full text-zinc-600 text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
                            Cancelar Turno
                        </button>
                    </div>
                )}

                {appt.status === 'done' && (
                    <div className="text-center py-6 bg-green-500/5 rounded-[2.5rem] border border-green-500/20">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="text-green-500 font-bold">Turno Finalizado y Cobrado</p>
                    </div>
                )}
            </div>
        </div>
    );
}
