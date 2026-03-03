"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { X, Clock, User, Scissors, Phone, CheckCircle2, DollarSign, Edit3, Play, Check } from 'lucide-react';

interface BottomSheetProps {
    appt: any;
    onClose: () => void;
    onRefresh: () => void;
}

export default function BottomSheet({ appt, onClose, onRefresh }: BottomSheetProps) {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isEditingDuration, setIsEditingDuration] = useState(false);
    const [tempDuration, setTempDuration] = useState(appt.durationMin);
    const [loading, setLoading] = useState(false);

    const handleStatus = async (status: string) => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/appointment/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId: appt.id, status })
            });
            if (res.ok) {
                onRefresh();
                onClose();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClosePay = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/close-pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId: appt.id,
                    method: paymentMethod,
                    tip: 0,
                    discount: 0
                })
            });
            if (res.ok) {
                onRefresh();
                onClose();
            }
        } finally {
            setLoading(false);
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
        }
    };

    const statusConfig: any = {
        pending: { label: 'Pendiente', color: 'bg-amber-500/10 text-amber-500' },
        confirmed: { label: 'Confirmado', color: 'bg-green-500/10 text-green-500' },
        in_progress: { label: 'En Silla', color: 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' },
        done: { label: 'Finalizado', color: 'bg-blue-500/10 text-blue-500' },
        cancelled: { label: 'Cancelado', color: 'bg-red-500/10 text-red-500' }
    };

    const currentStatus = statusConfig[appt.status] || { label: appt.status, color: 'bg-zinc-800 text-zinc-500' };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
            <div className={`
                relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[3rem] p-8 pb-12 
                pointer-events-auto transition-transform duration-500 transform slide-in-bottom shadow-3xl
            `}>
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-8" />

                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Cliente</p>
                        <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">{appt.clientName}</h2>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20 mt-2">
                            <Scissors className="w-3 h-3 text-[#D4AF37]" />
                            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">{appt.serviceName}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-1">Estado</p>
                        <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full italic tracking-widest ${currentStatus.color}`}>
                            {currentStatus.label}
                        </span>
                    </div>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-black/40 p-5 rounded-[2rem] border border-white/5 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><Clock className="w-8 h-8 text-[#D4AF37]" /></div>
                        <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest mb-2">Duración Estimada</p>
                        <div className="flex items-center gap-2">
                            {isEditingDuration ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={tempDuration}
                                        onChange={(e) => setTempDuration(Number(e.target.value))}
                                        className="w-16 bg-zinc-800 border border-[#D4AF37] rounded-xl px-2 py-1.5 text-xs text-white"
                                        autoFocus
                                    />
                                    <button onClick={updateDuration} className="p-1.5 bg-[#D4AF37] text-black rounded-lg"><Check className="w-3 h-3" /></button>
                                </div>
                            ) : (
                                <>
                                    <p className="font-black text-white text-lg">{appt.durationMin} <span className="text-[10px] text-zinc-600 ml-1">MIN</span></p>
                                    <button onClick={() => { setIsEditingDuration(true); setTempDuration(appt.durationMin); }} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg">
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="bg-black/40 p-5 rounded-[2rem] border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><Phone className="w-8 h-8 text-[#D4AF37]" /></div>
                        <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest mb-2">Contacto</p>
                        <p className="font-black text-white text-sm tracking-widest">{appt.clientPhone}</p>
                    </div>
                </div>

                {/* Actions Based on Status */}
                <div className="space-y-4">
                    {appt.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" onClick={() => handleStatus('cancelled')} className="border-red-500/20 text-red-500 py-6 text-xs uppercase tracking-widest font-black">Rechazar</Button>
                            <Button onClick={() => handleStatus('confirmed')} className="bg-[#D4AF37] text-black py-6 text-xs uppercase tracking-widest font-black">Aceptar</Button>
                        </div>
                    )}

                    {appt.status === 'confirmed' && (
                        <Button onClick={() => handleStatus('in_progress')} className="w-full bg-[#D4AF37] text-black py-7 text-sm uppercase tracking-widest font-black flex items-center justify-center gap-3 group">
                            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                            Comenzar Turno (En Silla)
                        </Button>
                    )}

                    {appt.status === 'in_progress' && (
                        <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-8 rounded-[3rem]">
                            <p className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em] mb-6 text-center">Finalizar y Registrar Pago</p>
                            <div className="flex gap-3 mb-6">
                                {[
                                    { id: 'cash', label: 'Efectivo' },
                                    { id: 'transfer', label: 'Transfer' },
                                    { id: 'card', label: 'Tarjeta' }
                                ].map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setPaymentMethod(m.id)}
                                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border
                                            ${paymentMethod === m.id
                                                ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20'
                                                : 'bg-black/40 text-zinc-500 border-white/5 hover:border-zinc-700'}`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                            <Button onClick={handleClosePay} disabled={loading} className="w-full bg-[#D4AF37] text-black py-6 font-black uppercase text-xs tracking-widest shadow-2xl shadow-[#D4AF37]/20">
                                {loading ? 'Procesando...' : 'Finalizar y Cobrar'}
                            </Button>
                        </div>
                    )}

                    {(appt.status === 'confirmed' || appt.status === 'in_progress') && (
                        <button
                            onClick={() => handleStatus('cancelled')}
                            className="w-full text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em] hover:text-red-500 transition-colors pt-4"
                        >
                            Cancelar este turno
                        </button>
                    )}

                    {appt.status === 'done' && (
                        <div className="text-center py-10 bg-green-500/5 rounded-[3rem] border border-green-500/10">
                            <div className="inline-flex p-4 bg-green-500/20 rounded-full mb-4">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <p className="text-green-500 font-black uppercase tracking-[0.2em] italic text-xs">Servicio Completado Exitosamente</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-full transition-all text-zinc-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
