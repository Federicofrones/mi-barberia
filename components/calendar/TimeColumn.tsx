import React from 'react';

interface TimeColumnProps {
    startHour: number;
    endHour: number;
    pixelsPerMinute: number;
}

export default function TimeColumn({ startHour, endHour, pixelsPerMinute }: TimeColumnProps) {
    const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

    return (
        <div className="w-16 flex-shrink-0 border-r border-white/5 bg-black sticky left-0 z-20">
            <div className="h-12 border-b border-white/5 bg-zinc-900/50 flex items-center justify-center font-black text-[9px] text-[#D4AF37] uppercase tracking-widest">
                Hora
            </div>
            <div className="relative" style={{ height: (endHour - startHour) * 60 * pixelsPerMinute }}>
                {hours.map(h => (
                    <div
                        key={h}
                        className="absolute w-full border-t border-white/5 flex items-start justify-center text-[9px] text-zinc-500 font-bold -mt-2.5"
                        style={{ top: (h - startHour) * 60 * pixelsPerMinute }}
                    >
                        <span className="bg-black px-1.5">{`${h.toString().padStart(2, '0')}:00`}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
