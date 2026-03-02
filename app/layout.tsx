import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Barbería Profesional',
    description: 'Reserva tu turno en nuestra Barbería Profesional',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={`${inter.className} min-h-screen bg-white`}>{children}</body>
        </html>
    );
}
