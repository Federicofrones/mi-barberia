import AdminNav from '@/components/AdminNav';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 flex-col lg:flex-row">
            <AdminNav />
            <main className="flex-1 lg:ml-64 overflow-y-auto p-4 lg:p-8 pt-20 lg:pt-8">
                {children}
            </main>
        </div>
    );
}
