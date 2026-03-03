"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { Star, Scissors, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ReviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) return alert("Por favor elige una puntuación");
        setStatus('loading');
        try {
            const res = await fetch('/api/public/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId: id, rating, comment })
            });
            if (res.ok) {
                setStatus('success');
            } else {
                const data = await res.json();
                throw new Error(data.error || "Error al enviar");
            }
        } catch (err: any) {
            setMsg(err.message);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <Card className="w-full max-w-md text-center p-10 bg-zinc-900/40 border-white/5 backdrop-blur-3xl rounded-[3rem]">
                    <div className="inline-flex p-5 bg-green-500/10 rounded-full mb-6">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">¡GRACIAS POR TU FEEDBACK!</h1>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-8">
                        Tu opinión nos ayuda a mantener la excelencia en cada corte.
                    </p>
                    <Button onClick={() => window.location.href = '/'}>Volver al Inicio</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <Card className="w-full max-w-md p-10 bg-zinc-900/40 border-white/5 backdrop-blur-3xl rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-[#D4AF37]/10 rounded-full mb-6 border border-[#D4AF37]/20">
                        <Scissors className="w-8 h-8 text-[#D4AF37]" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Tu Experiencia</h1>
                    <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mt-2">Elite Grooming Standard</p>
                </div>

                <div className="space-y-8">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">¿Qué tan satisfecho quedaste?</p>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`p-2 transition-all duration-300 transform active:scale-90 ${rating >= star ? 'scale-110' : 'grayscale opacity-20'}`}
                                >
                                    <Star className={`w-10 h-10 ${rating >= star ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-zinc-500'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2 ml-1">
                            <MessageSquare className="w-4 h-4 text-zinc-700" />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Comentario (Opcional)</p>
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Ej: 'Excelente atención de Lucas, muy conforme...'"
                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-[#D4AF37] focus:outline-none min-h-[120px] transition-all"
                        />
                    </div>

                    {status === 'error' && (
                        <p className="text-red-500 text-xs text-center font-bold bg-red-500/10 p-4 rounded-2xl">{msg}</p>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={status === 'loading'}
                        className="py-6 font-black uppercase tracking-widest text-xs shadow-2xl shadow-[#D4AF37]/20"
                    >
                        {status === 'loading' ? 'Enviando...' : 'Publicar Reseña'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
