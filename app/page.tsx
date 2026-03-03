import Link from 'next/link';
import { Scissors, Star, ShieldCheck, MapPin, Clock3, Phone } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">
            {/* Background Texture & Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black pointer-events-none" />

            {/* Light Rays / Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-[#D4AF37]/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Static Content */}
            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-12">
                    <div className="inline-flex p-6 rounded-[2.5rem] bg-[#D4AF37] shadow-2xl shadow-[#D4AF37]/30 mb-8 border-[6px] border-black hover:rotate-3 transition-transform duration-500">
                        <Scissors className="w-12 h-12 text-black" strokeWidth={2.5} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-zinc-900/50 border border-[#D4AF37]/20 rounded-full mb-6">
                        <Star className="w-3 h-3 text-[#D4AF37]" fill="currentColor" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-[#D4AF37] uppercase">The Gold Standard</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white text-center leading-[0.9] drop-shadow-2xl">
                        ELITE <br /> <span className="text-[#D4AF37] not-italic">BARBER</span> STUDIO
                    </h1>
                </div>

                <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl text-center mb-12 leading-relaxed">
                    Elevamos el arte del corte clásico a una experiencia de lujo. <br className="hidden md:block" />
                    Diseño, precisión y un estilo inconfundible.
                </p>

                {/* Call context */}
                <div className="flex flex-col md:flex-row items-center gap-6 w-full max-w-lg">
                    <Link
                        href="/book"
                        className="w-full md:flex-1 py-6 bg-[#D4AF37] text-black font-black uppercase text-sm tracking-[0.2em] rounded-3xl shadow-2xl shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 group"
                    >
                        Reservar Mi Turno
                        <div className="p-1 bg-black rounded-full group-hover:translate-x-1 transition-transform">
                            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                        </div>
                    </Link>

                    <Link
                        href="/login"
                        className="w-full md:w-auto px-8 py-6 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.2em] rounded-3xl hover:bg-white/10 transition-all text-center"
                    >
                        Admin
                    </Link>
                </div>

                {/* Features / Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full border-t border-white/5 pt-16">
                    <div className="flex flex-col items-center gap-3 group">
                        <div className="p-3 rounded-2xl bg-zinc-900 group-hover:bg-[#D4AF37]/10 transition-colors">
                            <MapPin className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ubicación</p>
                        <p className="font-bold text-sm text-white">Centro, Montevideo</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 group">
                        <div className="p-3 rounded-2xl bg-zinc-900 group-hover:bg-[#D4AF37]/10 transition-colors">
                            <Clock3 className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Horarios</p>
                        <p className="font-bold text-sm text-white">Lun - Sáb: 10 a 20hs</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 group">
                        <div className="p-3 rounded-2xl bg-zinc-900 group-hover:bg-[#D4AF37]/10 transition-colors">
                            <Phone className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Contacto</p>
                        <p className="font-bold text-sm text-white">+598 99 000 000</p>
                    </div>
                </div>

                {/* Footer simple */}
                <footer className="mt-20 pb-10 text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    Premium Grooming Experience • Copyright 2024
                </footer>
            </div>
        </main>
    );
}
