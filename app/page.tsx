import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Barbería Profesional</h1>
            <p className="text-gray-600 mb-8 max-w-md">Bienvenido a nuestro sistema de reservas. Selecciona un servicio, encuentra a tu barbero favorito y elige tu turno.</p>

            <Link
                href="/book"
                className="bg-black text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-zinc-800 transition-colors shadow-lg"
            >
                Reservar Turno
            </Link>
        </main>
    );
}
