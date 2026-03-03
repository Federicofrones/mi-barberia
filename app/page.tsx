"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Scissors, Star, ShieldCheck, MapPin, Clock3, Phone, MessageSquare, Quote } from 'lucide-react';

const DEFAULT_GALLERY = [
    '/gallery/1.png',
    '/gallery/2.png',
    '/gallery/3.png',
    '/gallery/4.png',
    '/gallery/5.png',
    '/gallery/6.png',
];

function Gallery({ images }: { images: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const displayImages = images && images.length > 0 ? images.filter(i => i !== '') : DEFAULT_GALLERY;

    useEffect(() => {
        if (displayImages.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [displayImages.length]);

    if (displayImages.length === 0) return null;

    return (
        <div className="w-full max-w-5xl px-6 mb-32 group">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl bg-zinc-900/20">
                {displayImages.map((img, idx) => (
                    <div
                        key={img + idx}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-110 rotate-1'
                            }`}
                    >
                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
                    </div>
                ))}

                {/* Navigation Dots */}
                {displayImages.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {displayImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Overlay Text */}
                <div className="absolute inset-x-8 bottom-12 md:inset-x-16 md:bottom-16 z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2">Nuestro Santuario</p>
                    <h2 className="text-3xl md:text-5xl font-black italic text-white tracking-tighter shadow-black drop-shadow-lg">EL ARTE DE LA <br /> PRECISIÓN</h2>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [branding, setBranding] = useState<any>(null);

    useEffect(() => {
        fetch('/api/public/reviews')
            .then(res => res.json())
            .then(data => setReviews(data.reviews || []));

        fetch('/api/admin/branding')
            .then(res => res.json())
            .then(data => setBranding(data));
    }, []);

    const logo = branding?.logoUrl || '/brand/logo.png';
    const gallery = branding?.gallery || [];

    return (
        <main className="min-h-screen bg-black text-white relative flex flex-col items-center overflow-x-hidden">
            {/* Background Texture & Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[100vh] bg-gradient-to-b from-[#D4AF37]/5 via-black to-black pointer-events-none" />

            {/* Hero Section */}
            <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center pt-24 pb-32">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-12">
                    <div className="relative mb-12 group">
                        <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                        <div className="relative w-32 h-32 rounded-full border-[3px] border-[#D4AF37]/30 p-2 overflow-hidden bg-black shadow-2xl flex items-center justify-center">
                            <img src={logo} alt="Elite Barber Logo" className="max-w-full max-h-full object-contain rounded-full" />
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900/50 border border-[#D4AF37]/20 rounded-full mb-6 text-center">
                        <Star className="w-3 h-3 text-[#D4AF37]" fill="currentColor" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-[#D4AF37] uppercase">The Gold Standard</span>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white text-center leading-[0.85] drop-shadow-2xl">
                        ELITE <br /> <span className="text-[#D4AF37] not-italic uppercase">Barber</span> STUDIO
                    </h1>
                </div>

                <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl text-center mb-16 leading-relaxed">
                    Elevamos el arte del corte clásico a una experiencia de lujo. <br className="hidden md:block" />
                    Diseño, precisión y un estilo inconfundible.
                </p>

                {/* Call context */}
                <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-xs mb-32">
                    <Link
                        href="/book"
                        className="w-full py-7 bg-[#D4AF37] text-black font-black uppercase text-sm tracking-[0.2em] rounded-3xl shadow-2xl shadow-[#D4AF37]/20 hover:scale-[1.05] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 group"
                    >
                        Reservar Mi Turno
                        <div className="p-1 bg-black rounded-full group-hover:translate-x-1 transition-transform">
                            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                        </div>
                    </Link>
                </div>

                {/* Gallery Section */}
                <Gallery images={gallery} />

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
