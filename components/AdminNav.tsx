"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Users, Briefcase, Settings, LogOut, LayoutDashboard, DollarSign, Menu, X } from 'lucide-react';

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
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
                <h1 className="text-lg font-bold">Barbería Admin</h1>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col fixed inset-y-0 left-0 z-40
                transition-transform duration-300 transform
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4 border-b border-gray-200 hidden lg:block">
                    <h1 className="text-xl font-bold tracking-tight">Barbería Admin</h1>
                </div>

                <nav className="flex-1 p-4 pt-20 lg:pt-4 space-y-1 overflow-y-auto">
                    {menu.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 w-full text-left rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Salir
                    </button>
                </div>
            </aside>
        </>
    );
}
