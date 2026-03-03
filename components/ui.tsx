import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
    const baseStyle = "w-full rounded-2xl px-6 py-3 font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-[#D4AF37] text-black hover:bg-[#F1D279] shadow-lg shadow-[#D4AF37]/10",
        secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 hover:border-[#D4AF37]",
    };

    return (
        <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const Input = ({ label, className = '', ...props }: any) => {
    return (
        <div className="flex flex-col gap-1.5 w-full text-white">
            {label && <label className="text-xs font-black uppercase tracking-widest text-[#D4AF37] ml-1">{label}</label>}
            <input
                className={`w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-black focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 transition-all outline-none ${className}`}
                {...props}
            />
        </div>
    );
};

export const Select = ({ label, options, children, className = '', ...props }: any) => {
    return (
        <div className="flex flex-col gap-1.5 w-full text-white">
            {label && <label className="text-xs font-black uppercase tracking-widest text-[#D4AF37] ml-1">{label}</label>}
            <select
                className={`w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:bg-black focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/5 transition-all appearance-none cursor-pointer outline-none ${className}`}
                {...props}
            >
                {options ? (
                    <>
                        <option value="" disabled className="bg-zinc-900">Seleccionar</option>
                        {options.map((o: any) => (
                            <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>
                        ))}
                    </>
                ) : children}
            </select>
        </div>
    );
};

export const Card = ({ children, className = '' }: any) => (
    <div className={`bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-white/5 shadow-2xl p-6 ${className}`}>
        {children}
    </div>
);
