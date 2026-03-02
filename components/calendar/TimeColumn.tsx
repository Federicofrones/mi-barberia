import React from 'react';

interface TimeColumnProps {
    startHour: number;
    endHour: number;
    pixelsPerMinute: number;
}

export default function TimeColumn({ startHour, endHour, pixelsPerMinute }: TimeColumnProps) {
    const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

    return (
        <div className="w-16 flex-shrink-0 border-r border-gray-200 bg-white sticky left-0 z-20">
            <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center justify-center font-semibold text-xs text-gray-500">
                GMT-3
            </div>
            <div className="relative" style={{ height: (endHour - startHour) * 60 * pixelsPerMinute }}>
                {hours.map(h => (
                    <div
                        key={h}
                        className="absolute w-full border-t border-gray-100 flex items-start justify-center text-xs text-gray-400 -mt-2.5 pb-2"
                        style={{ top: (h - startHour) * 60 * pixelsPerMinute }}
                    >
                        <span className="bg-white px-1 relative -top-0.5">{`${h.toString().padStart(2, '0')}:00`}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
