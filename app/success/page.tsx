"use client";

import { useSearchParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { CheckCircle2, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();

    const id = searchParams.get('id');
    const token = searchParams.get('token');
    const b = searchParams.get('b');
    const s = searchParams.get('s');
    const d = searchParams.get('d');
    const t = searchParams.get('t');

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const cancelUrl = `${baseUrl}/cancel?aid=${id}&token=${token}`;

    const textMsg = encodeURIComponent(
        `¡Hola! Confirmo mi reserva 💈\n\n📌 Servicio: ${s}\n✂️ Barbero: ${b}\n📅 Fecha: ${d}\n⏰ Hora: ${t}\n\nEn caso de no poder asistir, podés cancelar desde aquí:\n${cancelUrl}`
    );

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.02)_0%,transparent_70%)]" />

            <Card className="w-full max-w-md text-center bg-zinc-900/40 border-white/5 backdrop-blur-3xl rounded-[3rem] shadow-3xl p-10 relative overflow-hidden">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                <div className="relative mb-8">
                    <div className="inline-flex p-5 bg-green-500/10 rounded-full mb-6 relative">
                        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                        <CheckCircle2 className="w-16 h-16 text-green-500 relative" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2 italic uppercase">¡TURNO SOLICITADO!</h1>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20">
                        <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                        <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Reserva Protegida</span>
                    </div>
                </div>

                <div className="bg-black/40 rounded-[2rem] border border-white/5 p-6 mb-8 text-left space-y-4">
                    <div className="flex justify-between items-center group">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Servicio</span>
                        <span className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">{s}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Barbero</span>
                        <span className="text-sm font-bold text-white transition-colors">{b}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Agenda</span>
                        <span className="text-sm font-bold text-white transition-colors uppercase">{d} • {t} hs</span>
                    </div>
                </div>

                <div className="p-6 bg-[#D4AF37]/5 rounded-[2rem] border border-[#D4AF37]/10 border-dashed mb-8">
                    <p className="text-xs font-bold text-[#D4AF37] mb-4 flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        ACCIÓN REQUERIDA
                    </p>
                    <p className="text-[11px] text-[#D4AF37] font-medium leading-relaxed opacity-80 uppercase tracking-wider">
                        Para confirmar definitivamente tu lugar en la agenda, debés enviar tu confirmación por WhatsApp ahora.
                    </p>
                </div>

                <div className="space-y-4">
                    <a
                        href={`https://wa.me/59899000000?text=${textMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white rounded-2xl px-6 py-5 font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#25D366]/20"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        Confirmar via WhatsApp
                    </a>

                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-3">Enlace Directo de Cancelación</p>
                        <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-[8px] text-zinc-600 font-mono break-all line-clamp-1">
                            {cancelUrl}
                        </div>
                    </div>
                </div>

                <p className="mt-10 text-[9px] font-black text-zinc-800 uppercase tracking-[0.3em]">
                    Gracias por elegir la excelencia
                </p>
            </Card>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Generando confirmación...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
