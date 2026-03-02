import { Card } from '@/components/ui';
import { adminDb } from '@/lib/firebase/admin';
import { globalConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage({ searchParams }: { searchParams: { date?: string } }) {
    const dateKey = searchParams.date || new Date().toISOString().split('T')[0];

    const shopRef = adminDb.collection('shops').doc(globalConfig.shopId);
    const snapshot = await shopRef.collection('appointments')
        .where('dateKey', '==', dateKey)
        .orderBy('startAt', 'asc')
        .get();

    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Listado de Turnos</h1>
                <form className="flex items-center gap-2">
                    <input
                        type="date"
                        name="date"
                        defaultValue={dateKey}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <button type="submit" className="bg-black text-white px-4 py-2 rounded-md font-medium">Buscar</button>
                </form>
            </div>

            <Card>
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Hora</th>
                            <th className="py-2">Barbero</th>
                            <th className="py-2">Servicio</th>
                            <th className="py-2">Cliente</th>
                            <th className="py-2">Teléfono</th>
                            <th className="py-2">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-4 text-gray-500">No hay turnos para esta fecha</td></tr>
                        ) : null}
                        {appointments.map(a => {
                            const startAtStr = a.startAt?.toDate ? a.startAt.toDate().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }) :
                                new Date(a.startAt._seconds * 1000).toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });

                            return (
                                <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50 h-12">
                                    <td className="font-medium">{startAtStr}</td>
                                    <td>{a.barberName}</td>
                                    <td>{a.serviceName} ({a.durationMin}m)</td>
                                    <td>{a.clientName}</td>
                                    <td>{a.clientPhone}</td>
                                    <td>
                                        <span className={`px-2 py-1 text-xs rounded-full 
                      ${a.status === 'done' ? 'bg-green-100 text-green-800' :
                                                a.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    a.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        a.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
                                        >
                                            {a.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
