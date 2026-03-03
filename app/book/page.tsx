"use client";

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Button, Select, Input } from '@/components/ui';
import { Clock, Calendar, Scissors, User, ChevronRight, ChevronLeft, CheckCircle2, Star } from 'lucide-react';

function BookWizardContent() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [shop, setShop] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [barbers, setBarbers] = useState<any[]>([]);

    const [selectedService, setSelectedService] = useState('');
    const [selectedBarber, setSelectedBarber] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const [slots, setSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState('');

    const [clientInfo, setClientInfo] = useState({ name: '', phone: '', email: '' });

    useEffect(() => {
        fetch('/api/public/bootstrap')
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setShop(data.shop);
                setServices(data.services);
                setBarbers(data.barbers);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const loadSlots = useCallback(async () => {
        if (!selectedService || !selectedBarber || !selectedDate) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/public/availability?barberId=${selectedBarber}&serviceId=${selectedService}&dateKey=${selectedDate}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setSlots(data.slots || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [selectedBarber, selectedDate, selectedService]);

    useEffect(() => {
        if (step === 3 && selectedDate) {
            loadSlots();
            setSelectedSlot('');
        }
    }, [step, selectedDate, loadSlots]);

    const handleBooking = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/public/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    barberId: selectedBarber,
                    serviceId: selectedService,
                    dateKey: selectedDate,
                    timeKey: selectedSlot,
                    clientName: clientInfo.name,
                    clientPhone: clientInfo.phone,
                    clientEmail: clientInfo.email
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al reservar');

            const bName = barbers.find(b => b.id === selectedBarber)?.displayName;
            const sName = services.find(s => s.id === selectedService)?.name;

            router.push(`/success?id=${data.appointmentId}&token=${data.cancelToken}&b=${bName}&s=${sName}&d=${selectedDate}&t=${selectedSlot}&p=${clientInfo.phone}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && step === 1 && !shop) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-black flex flex-col items-center py-12 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-3xl -mr-32 -mt-32 rounded-full" />

            <div className="w-full max-w-lg relative">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex p-3 bg-[#D4AF37] rounded-2xl shadow-xl shadow-[#D4AF37]/20 mb-6">
                        <Scissors className="w-8 h-8 text-black" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic">RESERVA TU TURNO</h1>
                    <p className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-[10px]">Experiencia de Lujo & Estilo</p>
                </div>

                {/* Progress Tracker */}
                <div className="flex justify-between items-center mb-10 px-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500
                                ${step >= i ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-110' : 'bg-zinc-800 text-zinc-500'}`}>
                                {i}
                            </div>
                            {i < 4 && <div className={`h-[2px] w-12 md:w-20 mx-2 rounded-full transition-colors duration-500 ${step > i ? 'bg-[#D4AF37]' : 'bg-zinc-800'}`} />}
                        </div>
                    ))}
                </div>

                <Card className="border border-white/5 bg-zinc-900/40 backdrop-blur-3xl p-8 rounded-[3rem] shadow-3xl">
                    {/* Step 1: Service & Barber */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 mb-2 block">Selecciona el Servicio</label>
                                <div className="space-y-3">
                                    {services.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => setSelectedService(s.id)}
                                            className={`w-full group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
                                                ${selectedService === s.id ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/5' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-xl transition-colors ${selectedService === s.id ? 'bg-[#D4AF37] text-black' : 'bg-zinc-800 text-zinc-500 group-hover:text-white'}`}>
                                                    <Scissors className="w-5 h-5" />
                                                </div>
                                                <div className="text-left">
                                                    <p className={`font-bold transition-colors ${selectedService === s.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{s.name}</p>
                                                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{s.baseDurationMin} min</p>
                                                </div>
                                            </div>
                                            <p className={`text-lg font-black tracking-tighter ${selectedService === s.id ? 'text-[#D4AF37]' : 'text-zinc-500'}`}>${s.price}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1 mb-2 block">Elige a tu Profesional</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {barbers.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => setSelectedBarber(b.id)}
                                            className={`group relative p-4 rounded-[2rem] border transition-all duration-300 text-center
                                                ${selectedBarber === b.id ? 'bg-[#D4AF37] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                                        >
                                            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-xl font-black transition-colors overflow-hidden
                                                ${selectedBarber === b.id ? 'bg-black text-[#D4AF37]' : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'}`}>
                                                {b.photoUrl ? (
                                                    <img src={b.photoUrl} alt={b.displayName} className="w-full h-full object-cover" />
                                                ) : b.displayName.charAt(0)}
                                            </div>
                                            <p className={`text-xs font-black uppercase tracking-widest transition-colors ${selectedBarber === b.id ? 'text-black' : 'text-zinc-400'}`}>
                                                {b.displayName.split(' ')[0]}
                                            </p>
                                            {selectedBarber === b.id && (
                                                <div className="absolute -top-1 -right-1 bg-black rounded-full border border-[#D4AF37] p-1">
                                                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                className="mt-4 py-5"
                                disabled={!selectedService || !selectedBarber}
                                onClick={() => setStep(2)}
                            >
                                Siguiente paso
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Date */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-[#D4AF37]" />
                                </div>
                                <h2 className="text-xl font-black text-white italic">¿CUÁNDO VIENES?</h2>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Selecciona una fecha disponible</p>
                            </div>

                            <div className="w-full relative px-1">
                                <Input
                                    label="Fecha del Turno"
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={selectedDate}
                                    onChange={(e: any) => setSelectedDate(e.target.value)}
                                    className="text-base py-3 bg-black border-white/10 text-[#D4AF37] w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <Button variant="outline" onClick={() => setStep(1)} className="py-4">Atrás</Button>
                                <Button disabled={!selectedDate} onClick={() => setStep(3)} className="py-4 shadow-xl shadow-[#D4AF37]/10">Continuar</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Time Slot */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center py-4">
                                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-6 h-6 text-[#D4AF37]" />
                                </div>
                                <h2 className="text-xl font-black text-white italic">HORARIOS DISPONIBLES</h2>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">{selectedDate}</p>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center py-20 gap-4">
                                    <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                                    <p className="text-zinc-600 font-black text-[10px] uppercase tracking-widest">Calculando espacios...</p>
                                </div>
                            ) : (
                                slots.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto p-2 no-scrollbar">
                                        {slots.map(h => (
                                            <button
                                                key={h}
                                                onClick={() => setSelectedSlot(h)}
                                                className={`py-4 rounded-2xl border text-sm font-black transition-all duration-300 active:scale-95
                                                    ${selectedSlot === h ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-xl shadow-[#D4AF37]/20' : 'bg-black/40 text-zinc-400 border-white/5 hover:border-white/20'}`}
                                            >
                                                {h}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center bg-red-500/5 border border-red-500/10 rounded-3xl">
                                        <p className="text-red-500 font-bold text-sm">Lo sentimos, no hay horarios para hoy.</p>
                                    </div>
                                )
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <Button variant="outline" onClick={() => setStep(2)} className="py-4">Atrás</Button>
                                <Button disabled={!selectedSlot} onClick={() => setStep(4)} className="py-4">Siguiente</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Client Info */}
                    {step === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-[#D4AF37]/10 p-6 rounded-[2.5rem] border border-[#D4AF37]/20 relative overflow-hidden">
                                <div className="absolute -top-4 -right-4 opacity-10">
                                    <Star className="w-16 h-16 text-[#D4AF37]" fill="currentColor" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em] mb-4">Resumen de tu Reserva</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-black/40 p-2 rounded-xl"><Scissors className="w-4 h-4 text-white" /></div>
                                        <p className="font-bold text-white">{services.find(s => s.id === selectedService)?.name}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-black/40 p-2 rounded-xl"><User className="w-4 h-4 text-white" /></div>
                                        <p className="font-bold text-white">{barbers.find(b => b.id === selectedBarber)?.displayName}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-black/40 p-2 rounded-xl"><Calendar className="w-4 h-4 text-white" /></div>
                                        <p className="font-bold text-white">{selectedDate} • {selectedSlot} hs</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Tu Nombre Completo"
                                    value={clientInfo.name}
                                    onChange={(e: any) => setClientInfo({ ...clientInfo, name: e.target.value })}
                                    placeholder="Ej. Martín Pérez"
                                    className="bg-black border-white/5"
                                />
                                <Input
                                    label="Tu WhatsApp"
                                    type="tel"
                                    value={clientInfo.phone}
                                    onChange={(e: any) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                                    placeholder="099123456"
                                    className="bg-black border-white/5"
                                />
                                <Input
                                    label="Correo Electrónico (Opcional)"
                                    type="email"
                                    value={clientInfo.email}
                                    onChange={(e: any) => setClientInfo({ ...clientInfo, email: e.target.value })}
                                    placeholder="correo@ejemplo.com"
                                    className="bg-black border-white/5"
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <Button variant="outline" onClick={() => setStep(3)} className="py-4">Atrás</Button>
                                <Button
                                    onClick={handleBooking}
                                    disabled={loading || !clientInfo.name || !clientInfo.phone}
                                    className="py-4 shadow-2xl shadow-[#D4AF37]/20"
                                >
                                    {loading ? 'Procesando...' : 'Confirmar Reserva'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <p className="text-center text-zinc-700 text-[10px] font-black uppercase mt-12 tracking-[0.2em]">
                    Premium Grooming Experience • Since 2024
                </p>
            </div>
        </div>
    );
}

export default function BookWizard() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Iniciando...</div>}>
            <BookWizardContent />
        </Suspense>
    )
}
