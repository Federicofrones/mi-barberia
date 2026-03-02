import React from 'react';

interface AppointmentCardProps {
    appointment: any;
    top: number;
    height: number;
    onClick: () => void;
}

export default function AppointmentCard({ appointment, top, height, onClick }: AppointmentCardProps) {
    const styleVariants = {
        pending: "bg-yellow-100 border-yellow-300 text-yellow-900 shadow-sm",
        confirmed: "bg-blue-100 border-blue-300 text-blue-900 shadow-sm",
        done: "bg-green-100 border-green-300 text-green-900 opacity-80",
        cancelled: "bg-red-50 border-red-200 text-red-500 line-through opacity-50",
        no_show: "bg-gray-200 border-gray-300 text-gray-700 opacity-60"
    };

    const statusStyle = styleVariants[appointment.status as keyof typeof styleVariants] || styleVariants.pending;

    const startStr = appointment.startAt?.toDate ? appointment.startAt.toDate().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }) :
        new Date(appointment.startAt._seconds * 1000).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

    return (
        <div
            onClick={onClick}
            className={`absolute w-[94%] left-[3%] rounded-md border text-xs p-1.5 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${statusStyle}`}
            style={{ top, height, zIndex: appointment.status === 'cancelled' ? 5 : 10 }}
        >
            <div className="font-bold truncate leading-tight">{startStr} - {appointment.clientName}</div>
            <div className="truncate text-[10px] mt-0.5 opacity-80">{appointment.serviceName}</div>
            {height > 40 && (
                <div className="hidden sm:block truncate text-[10px] mt-0.5 font-mono">{appointment.clientPhone}</div>
            )}
        </div>
    );
}
