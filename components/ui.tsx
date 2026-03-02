import React from 'react';

export const Button = ({ children, variant = 'primary', ...props }: any) => {
    const baseStyle = "w-full rounded-md px-4 py-2 font-medium transition-colors focus:outline-none focus:ring";
    const variants = {
        primary: "bg-black text-white hover:bg-zinc-800 disabled:opacity-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50",
        danger: "bg-red-500 text-white hover:bg-red-600 disabled:opacity-50",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    };

    return (
        <button className={`${baseStyle} ${variants[variant as keyof typeof variants]}`} {...props}>
            {children}
        </button>
    );
};

export const Input = ({ label, ...props }: any) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                {...props}
            />
        </div>
    );
};

export const Select = ({ label, options, children, ...props }: any) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                {...props}
            >
                {options ? (
                    <>
                        <option value="" disabled>Seleccionar</option>
                        {options.map((o: any) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </>
                ) : children}
            </select>
        </div>
    );
};

export const Card = ({ children, className = '' }: any) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${className}`}>
        {children}
    </div>
);
