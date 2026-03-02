"use client";

import { useSearchParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();

    const id = searchParams.get('id');
    const token = searchParams.get('token');
    const b = searchParams.get('b');
    const s = searchParams.get('s');
    const d = searchParams.get('d');
    const t = searchParams.get('t');

    // App base logic depends if it is localhost or prod
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const cancelUrl = `${baseUrl}/cancel?aid=${id}&token=${token}`;

    const textMsg = encodeURIComponent(
        `¡Hola! Confirmo mi reserva 💈\n\n📌 Servicio: ${s}\n✂️ Barbero: ${b}\n📅 Fecha: ${d}\n⏰ Hora: ${t}\n\nEn caso de no poder asistir, podés cancelar desde aquí:\n${cancelUrl}`
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">¡Reserva Pendiente!</h1>
                <p className="text-gray-600 mb-6 px-4">
                    Tu turno ha sido solicitado. El comercio lo confirmará pronto.
                </p>

                <div className="bg-gray-100 rounded-md p-4 mb-6 text-sm text-left mx-6">
                    <p><strong>Servicio:</strong> {s}</p>
                    <p><strong>Barbero:</strong> {b}</p>
                    <p><strong>Día:</strong> {d}</p>
                    <p><strong>Hora:</strong> {t}</p>
                </div>

                <p className="text-sm font-medium mb-4">Es obligatorio confirmar tu asistencia por WhatsApp:</p>

                <div className="px-6 flex flex-col gap-3">
                    <a
                        href={`https://wa.me/59899000000?text=${textMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full block bg-green-500 text-white rounded-md px-4 py-3 font-medium hover:bg-green-600 transition-colors"
                    >
                        Enviar WhatsApp
                    </a>

                    <div className="text-xs text-gray-400 mt-4 overflow-hidden text-clip whitespace-nowrap px-4 border rounded p-2">
                        Link de cancelación (guárdalo si no usas WA): <br />
                        {cancelUrl}
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
