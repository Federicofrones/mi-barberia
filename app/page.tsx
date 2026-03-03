"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Scissors, Star, ShieldCheck, MapPin, Clock3, Phone, MessageSquare, Quote } from 'lucide-react';

export default function Home() {
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/public/reviews')
            .then(res => res.json())
            .then(data => setReviews(data.reviews || []));
    }, []);

    return (
        <main className="min-h-screen bg-black text-white relative flex flex-col items-center overflow-x-hidden">
            {/* Background Texture & Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[100vh] bg-gradient-to-b from-[#D4AF37]/5 via-black to-black pointer-events-none" />

            {/* Hero Section */}
            <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center pt-24 pb-32">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-12">
                    <div className="inline-flex p-6 rounded-[2.5rem] bg-[#D4AF37] shadow-2xl shadow-[#D4AF37]/30 mb-8 border-[6px] border-black hover:rotate-3 transition-transform duration-500">
                        <Scissors className="w-12 h-12 text-black" strokeWidth={2.5} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900/50 border border-[#D4AF37]/20 rounded-full mb-6">
                        <Star className="w-3 h-3 text-[#D4AF37]" fill="currentColor" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-[#D4AF37] uppercase">The Gold Standard</span>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white text-center leading-[0.85] drop-shadow-2xl">
                        ELITE <br /> <span className="text-[#D4AF37] not-italic">BARBER</span> STUDIO
                    </h1>
                </div>

                <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl text-center mb-16 leading-relaxed">
                    Elevamos el arte del corte clásico a una experiencia de lujo. <br className="hidden md:block" />
                    Diseño, precisión y un estilo inconfundible.
                </p>

                {/* Call context */}
                <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-lg mb-32">
                    <Link
                        href="/book"
                        className="w-full md:flex-1 py-7 bg-[#D4AF37] text-black font-black uppercase text-sm tracking-[0.2em] rounded-3xl shadow-2xl shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 group"
                    >
                        Reservar Mi Turno
                        <div className="p-1 bg-black rounded-full group-hover:translate-x-1 transition-transform">
                            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                        </div>
                    </Link>

                    <Link
                        href="/login"
                        className="w-full md:w-auto px-10 py-7 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.2em] rounded-3xl hover:bg-white/10 transition-all text-center"
                    >
                        Admin
                    </Link>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full border-y border-white/5 py-16 mb-32">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-2xl bg-zinc-900">
                            <MapPin className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Encuéntranos</p>
                        <p className="font-bold text-base text-white">Centro, Montevideo</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 border-x border-white/5 md:px-6">
                        <div className="p-4 rounded-2xl bg-zinc-900">
                            <Clock3 className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Horarios</p>
                        <p className="font-bold text-base text-white">Lun - Sáb: 10 a 20hs</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-2xl bg-zinc-900">
                            <Phone className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Contacto</p>
                        <p className="font-bold text-base text-white">+598 99 000 000</p>
                    </div>
                </div>

                {/* Reviews Section */}
                {reviews.length > 0 && (
                    <div className="w-full text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 rounded-full mb-8 border border-white/5">
                            <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lo que dicen nuestros clientes</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reviews.map((r, i) => (
                                <div key={r.id} className={`p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 text-left relative overflow-hidden group ${i > 2 ? 'hidden lg:block' : ''}`}>
                                    <Quote className="absolute -top-4 -right-4 w-24 h-24 text-white/5 group-hover:text-[#D4AF37]/5 transition-colors" />
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`w-3 h-3 ${r.rating >= s ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-zinc-800'}`} />
                                        ))}
                                    </div>
                                    <p className="text-zinc-400 text-sm italic mb-6 relative z-10 line-clamp-3">"{r.comment || "Excelente atención y mi corte quedó perfecto."}"</p>
                                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                        <div>
                                            <p className="text-white font-black uppercase text-[10px] tracking-widest italic">{r.clientName}</p>
                                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">Barbero: {r.barberName}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer simple */}
                <footer className="mt-40 pb-10 text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em] text-center">
                    Premium Grooming Experience • Copyright 2024
                </footer>
            </div>
        </main>
    );
}
