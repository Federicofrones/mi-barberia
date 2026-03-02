import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import '../styles/globals.css';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Barbería Pro | Admin',
    description: 'Gestión profesional de barberías',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className="scroll-smooth">
            <body className={`${outfit.className} antialiased min-h-screen bg-white text-zinc-900`}>
                {children}
            </body>
        </html>
    );
}
