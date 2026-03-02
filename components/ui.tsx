import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
    const baseStyle = "w-full rounded-2xl px-6 py-3 font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-black text-white hover:bg-zinc-800 shadow-lg shadow-black/10",
        secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        danger: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300",
    };

    return (
        <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const Input = ({ label, className = '', ...props }: any) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">{label}</label>}
            <input
                className={`w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all ${className}`}
                {...props}
            />
        </div>
    );
};

export const Select = ({ label, options, children, className = '', ...props }: any) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">{label}</label>}
            <select
                className={`w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all appearance-none cursor-pointer ${className}`}
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
    <div className={`bg-white rounded-[2rem] border border-zinc-100 shadow-xl shadow-zinc-200/20 p-6 ${className}`}>
        {children}
    </div>
);
