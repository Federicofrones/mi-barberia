"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Calendar, Users, Briefcase, Settings, LogOut,
    LayoutDashboard, DollarSign, Menu, X, Scissors
} from 'lucide-react';

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/auth/session', { method: 'DELETE' });
        router.push('/login');
        router.refresh();
    };

    const menu = [
        { label: 'Agenda', icon: Calendar, href: '/admin' },
        { label: 'Cajón', icon: DollarSign, href: '/admin/cashier' },
        { label: 'Métricas', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: 'Turnos', icon: Calendar, href: '/admin/appointments' },
        { label: 'Barberos', icon: Users, href: '/admin/staff' },
        { label: 'Servicios', icon: Briefcase, href: '/admin/services' },
        { label: 'Setup', icon: Settings, href: '/admin/setup' },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-white/5 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-[#D4AF37] p-1.5 rounded-lg shadow-lg shadow-[#D4AF37]/20">
                        <Scissors className="w-5 h-5 text-black" />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter text-white">BARBER PRO</h1>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-zinc-400 hover:bg-zinc-900 rounded-xl transition-all"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-72 bg-black text-white h-full flex flex-col fixed inset-y-0 left-0 z-40
                transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform border-r border-white/5
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 hidden lg:block">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#D4AF37] p-2 rounded-xl shadow-xl shadow-[#D4AF37]/20">
                            <Scissors className="w-6 h-6 text-black" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">BARBER PRO</h1>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-24 lg:py-4 space-y-1.5 overflow-y-auto">
                    {menu.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group
                                    ${active
                                        ? 'bg-[#D4AF37] text-black shadow-xl shadow-[#D4AF37]/20'
                                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-4 w-full text-left rounded-2xl text-sm font-bold text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-red-500/20"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                    <p className="text-[10px] text-zinc-700 font-bold mt-6 text-center uppercase tracking-widest">
                        v2.1 Gold Edition
                    </p>
                </div>
            </aside>
        </>
    );
}
