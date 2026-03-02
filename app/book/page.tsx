"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Button, Select, Input } from '@/components/ui';

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

    const loadSlots = async () => {
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
    };

    useEffect(() => {
        if (step === 3 && selectedDate) {
            loadSlots();
            setSelectedSlot('');
        }
    }, [step, selectedDate]);

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

    if (loading && step === 1 && !shop) return <div className="p-8 text-center mt-20">Cargando...</div>;
    if (error && step === 1) return <div className="p-8 text-red-500 mt-20 text-center">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <Card className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Reserva de Turno</h1>

                {/* Step 1: Service & Barber */}
                {step === 1 && (
                    <div className="space-y-4">
                        <Select
                            label="1. Elige tu servicio"
                            value={selectedService}
                            onChange={(e: any) => setSelectedService(e.target.value)}
                            options={services.map(s => ({ value: s.id, label: `${s.name} - $${s.price}` }))}
                        />
                        <Select
                            label="2. Elige tu barbero"
                            value={selectedBarber}
                            onChange={(e: any) => setSelectedBarber(e.target.value)}
                            options={barbers.map(b => ({ value: b.id, label: b.displayName }))}
                        />
                        <Button
                            className="mt-6"
                            disabled={!selectedService || !selectedBarber}
                            onClick={() => setStep(2)}
                        >
                            Siguiente
                        </Button>
                    </div>
                )}

                {/* Step 2: Date */}
                {step === 2 && (
                    <div className="space-y-4">
                        <Input
                            label="3. Selecciona la fecha"
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={selectedDate}
                            onChange={(e: any) => setSelectedDate(e.target.value)}
                        />
                        <div className="flex gap-2 mt-6">
                            <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
                            <Button disabled={!selectedDate} onClick={() => setStep(3)}>Buscar Horarios</Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Time Slot */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="font-medium text-sm text-gray-700">4. Selecciona un horario</h3>
                        {loading ? <div className="text-sm">Buscando horarios...</div> : (
                            slots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1">
                                    {slots.map(h => (
                                        <button
                                            key={h}
                                            onClick={() => setSelectedSlot(h)}
                                            className={`py-2 rounded border text-sm transition-colors ${selectedSlot === h ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            ) : <p className="text-red-500 text-sm">No hay horarios disponibles para esta fecha.</p>
                        )}

                        <div className="flex gap-2 mt-6">
                            <Button variant="outline" onClick={() => setStep(2)}>Atrás</Button>
                            <Button disabled={!selectedSlot} onClick={() => setStep(4)}>Siguiente</Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Client Info */}
                {step === 4 && (
                    <div className="space-y-4">
                        <h3 className="font-bold mb-2">Resumen de reserva</h3>
                        <div className="bg-gray-100 p-3 rounded text-sm mb-4 space-y-1">
                            <p>💈 {services.find(s => s.id === selectedService)?.name}</p>
                            <p>✂️ {barbers.find(b => b.id === selectedBarber)?.displayName}</p>
                            <p>📅 {selectedDate} a las {selectedSlot}</p>
                        </div>

                        <Input
                            label="Tu Nombre"
                            value={clientInfo.name}
                            onChange={(e: any) => setClientInfo({ ...clientInfo, name: e.target.value })}
                            placeholder="Ej. Martín"
                        />
                        <Input
                            label="WhatsApp"
                            type="tel"
                            value={clientInfo.phone}
                            onChange={(e: any) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                            placeholder="099123456"
                        />
                        <Input
                            label="Email (opcional)"
                            type="email"
                            value={clientInfo.email}
                            onChange={(e: any) => setClientInfo({ ...clientInfo, email: e.target.value })}
                            placeholder="correo@ejemplo.com"
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="flex gap-2 mt-6">
                            <Button variant="outline" onClick={() => setStep(3)}>Atrás</Button>
                            <Button
                                onClick={handleBooking}
                                disabled={loading || !clientInfo.name || !clientInfo.phone}
                            >
                                {loading ? 'Confirmando...' : 'Confirmar Reserva'}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default function BookWizard() {
    return (
        <Suspense fallback={<div>Cargando asistente...</div>}>
            <BookWizardContent />
        </Suspense>
    )
}
