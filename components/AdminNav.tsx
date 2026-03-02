"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, Users, Briefcase, Settings, LogOut, LayoutDashboard, DollarSign } from 'lucide-react';

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();

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
        <aside className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col fixed inset-y-0 left-0">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold tracking-tight">Barbería Admin</h1>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menu.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
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
    );
}
