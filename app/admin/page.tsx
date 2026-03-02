"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, Input } from '@/components/ui';
import DayCalendar from '@/components/calendar/DayCalendar';

export default function CalendarPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [barbers, setBarbers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [apptRes, barberRes] = await Promise.all([
                fetch(`/api/admin/appointments?dateKey=${date}`),
                fetch('/api/admin/barbers')
            ]);
            const appstData = await apptRes.json();
            const barbersData = await barberRes.json();

            setAppointments(appstData.appointments || []);
            setBarbers((barbersData.barbers || []).filter((b: any) => b.isActive));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-4 max-w-7xl h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <h1 className="text-2xl font-bold">Agenda Diaria</h1>
                <Input
                    type="date"
                    value={date}
                    onChange={(e: any) => setDate(e.target.value)}
                    className="w-auto"
                />
            </div>

            <Card className="flex-1 overflow-hidden p-0 flex flex-col">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400">Cargando agenda...</div>
                ) : (
                    <DayCalendar barbers={barbers} appointments={appointments} dateKey={date} onRefresh={fetchData} />
                )}
            </Card>
        </div>
    );
}
