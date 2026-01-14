import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#09090b]">
            <AdminSidebar />
            <div className="pl-64">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
