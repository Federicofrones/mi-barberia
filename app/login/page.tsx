"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Button, Input, Card } from '@/components/ui';
import { Scissors, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            const res = await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Access Denied');
            }

            if (data.role === 'admin') {
                router.push('/admin');
            } else if (data.role === 'barber') {
                router.push('/barber');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            console.error(err);
            setError('Credenciales inválidas o sin acceso.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#AA8A1E]/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-[#D4AF37] rounded-[2rem] shadow-2xl shadow-[#D4AF37]/20 mb-6 group hover:scale-110 transition-transform duration-500">
                        <Scissors className="w-10 h-10 text-black group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">BARBER PRO</h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Portal Administrativo</p>
                </div>

                <Card className="border border-white/5 bg-zinc-900/40 backdrop-blur-3xl p-8 rounded-[3rem] shadow-3xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                label="Correo Electrónico"
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e: any) => setEmail(e.target.value)}
                                required
                                className="pl-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                label="Contraseña"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e: any) => setPassword(e.target.value)}
                                required
                                className="pl-12"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="py-4 text-xs tracking-widest uppercase font-black shadow-xl shadow-[#D4AF37]/10">
                            {loading ? 'Verificando...' : 'Acceder al Sistema'}
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-zinc-600 text-[10px] font-bold uppercase mt-12 tracking-widest">
                    v2.1 Gold Edition • Exclusive Access
                </p>
            </div>
        </div>
    );
}
