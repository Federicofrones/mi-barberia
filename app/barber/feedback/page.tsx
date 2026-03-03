"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { Star, MessageSquare, Flame, TrendingUp } from 'lucide-react';

export default function BarberFeedback() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/barber/reviews')
            .then(res => res.json())
            .then(data => {
                setReviews(data.reviews || []);
            })
            .finally(() => setLoading(false));
    }, []);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "5.0";

    return (
        <div className="space-y-8 max-w-4xl">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Feedback de Clientes</h1>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Construyendo tu reputación Elite</p>
                </div>
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6">
                    <div className="text-center border-r border-white/5 pr-6">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Rating Promedio</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-white">{avgRating}</span>
                            <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Reseñas</p>
                        <p className="text-2xl font-black text-white">{reviews.length}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Cargando comentarios...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="py-20 bg-zinc-900/20 border border-dashed border-white/5 rounded-[3rem] text-center">
                        <MessageSquare className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                        <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest">Aún no has recibido valoraciones</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <Card key={review.id} className="bg-zinc-900/40 border-white/5 p-8 rounded-[2.5rem] group hover:border-[#D4AF37]/20 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-white uppercase italic">{review.clientName}</h3>
                                    <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest opacity-60">
                                        {review.serviceName} • {new Date(review.createdAt._seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-3.5 h-3.5 ${review.rating >= s ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-zinc-800'}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm italic leading-relaxed bg-black/20 p-5 rounded-2xl border border-white/5">
                                &quot;{review.comment || "Corte impecable, gran atención profesional."}&quot;
                            </p>
                            {review.rating === 5 && (
                                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
                                    <Flame className="w-3 h-3 text-green-500" />
                                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Reseña Perfecta</span>
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>

            <p className="text-center text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em] py-10">
                La excelencia no es un acto, es un hábito.
            </p>
        </div>
    );
}
