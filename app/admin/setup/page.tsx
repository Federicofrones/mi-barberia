"use client";

import { useState } from 'react';
import { Button, Card } from '@/components/ui';

export default function SetupPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSeed = async () => {
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/seed', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setMessage('✅ Seed completado con éxito. ' + data.message);
            } else {
                setMessage('❌ Error: ' + data.error);
            }
        } catch (err: any) {
            setMessage('❌ Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-lg">
            <h1 className="text-2xl font-bold">Setup del Sistema</h1>
            <Card>
                <h2 className="text-lg font-medium mb-2">Poblar Datos Demo</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Crea el documento de config principal, servicios de muestra, y un barbero (Juan el Barbero).
                    También intentará crear <code>admin@barberia.com</code> (Password123!)
                </p>
                <Button onClick={handleSeed} disabled={loading}>
                    {loading ? 'Inicializando...' : 'Correr Seed / Initialize Data'}
                </Button>
                {message && <div className="mt-4 p-3 bg-gray-100 rounded text-sm font-medium">{message}</div>}
            </Card>
        </div>
    );
}
