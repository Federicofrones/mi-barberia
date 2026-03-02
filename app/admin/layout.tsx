import AdminNav from '@/components/AdminNav';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-white flex-col lg:flex-row">
            <AdminNav />
            <main className="flex-1 lg:ml-72 overflow-y-auto p-4 lg:p-10 pt-20 lg:pt-10">
                {children}
            </main>
        </div>
    );
}
