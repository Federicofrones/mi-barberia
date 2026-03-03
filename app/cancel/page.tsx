"use client";

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Button, Card } from '@/components/ui';
import { XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

function CancelContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('aid');
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const handleCancel = async () => {
        setStatus('loading');
        try {
            const res = await fetch('/api/public/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId: id, token })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setStatus('success');
            setMsg('Turno cancelado exitosamente.');
        } catch (err: any) {
            setStatus('error');
            setMsg(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.02)_0%,transparent_70%)]" />

            <Card className="w-full max-w-md text-center bg-zinc-900/40 border-white/5 backdrop-blur-3xl rounded-[3rem] shadow-3xl p-10">
                <div className="mb-8">
                    <div className="inline-flex p-5 bg-zinc-800 rounded-full mb-6">
                        <XCircle className="w-16 h-16 text-zinc-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2 italic uppercase">CANCELAR TURNO</h1>
                    <div className="w-12 h-1 bg-[#D4AF37] mx-auto rounded-full" />
                </div>

                {!id || !token ? (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl">
                        <p className="text-red-500 font-bold text-sm">El enlace de cancelación es inválido o ha expirado.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {status === 'idle' && (
                            <>
                                <div className="p-6 bg-zinc-800/40 rounded-[2.5rem] border border-white/5">
                                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                                        ¿Estás seguro que deseas cancelar tu reserva? Esta acción no se puede deshacer y el horario quedará disponible para otros clientes.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Button variant="danger" onClick={handleCancel} className="py-5 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-red-500/10">
                                        Confirmar Cancelación
                                    </Button>
                                    <Button variant="outline" onClick={() => window.history.back()} className="py-5 text-xs font-black uppercase tracking-[0.2em]">
                                        Volver Atrás
                                    </Button>
                                </div>
                            </>
                        )}

                        {status === 'loading' && (
                            <div className="flex flex-col items-center py-12 gap-4">
                                <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                                <p className="text-zinc-500 font-black text-[10px] uppercase tracking-widest italic tracking-[0.3em]">Procesando Solicitud...</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="space-y-6 animate-in zoom-in duration-500">
                                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-[2.5rem]">
                                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                    <p className="text-green-500 font-black uppercase tracking-widest text-xs italic">{msg}</p>
                                </div>
                                <Button variant="outline" className="w-full py-5" onClick={() => window.location.href = '/'}>
                                    Volver al Inicio
                                </Button>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="space-y-6 animate-in shake duration-500">
                                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2.5rem]">
                                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                    <p className="text-red-500 font-bold text-sm italic">{msg}</p>
                                </div>
                                <Button variant="outline" className="w-full py-5" onClick={() => setStatus('idle')}>
                                    Reintentar
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <p className="mt-12 text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em] italic">
                    Esperamos verte pronto de regreso
                </p>
            </Card>
        </div>
    );
}

export default function CancelPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Iniciando asistente...</div>}>
            <CancelContent />
        </Suspense>
    );
}
