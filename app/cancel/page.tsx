"use client";

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Button, Card } from '@/components/ui';

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-sm text-center py-8 px-6">
                <h1 className="text-xl font-bold mb-4">Cancelar Turno</h1>

                {!id || !token ? (
                    <p className="text-red-500 text-sm">El link de cancelación es inválido o está incompleto.</p>
                ) : (
                    <>
                        {status === 'idle' && (
                            <>
                                <p className="mb-6 text-sm text-gray-600">¿Estás seguro que deseas cancelar tu reserva?</p>
                                <div className="flex gap-2">
                                    <Button variant="danger" onClick={handleCancel}>Confirmar Cancelación</Button>
                                </div>
                            </>
                        )}

                        {status === 'loading' && <p>Procesando...</p>}
                        {status === 'success' && <p className="text-green-600 font-medium">{msg}</p>}
                        {status === 'error' && <p className="text-red-500 text-sm">{msg}</p>}
                    </>
                )}
            </Card>
        </div>
    );
}

export default function CancelPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <CancelContent />
        </Suspense>
    );
}
