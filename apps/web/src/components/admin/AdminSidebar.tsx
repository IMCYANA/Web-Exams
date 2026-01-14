'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    CreditCard,
    MessageSquare,
    Wallet,
    Newspaper,
    Settings,
    LogOut,
    Home
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'เนื้อหา (เกม)', icon: Package, href: '/admin/products' },
    { label: 'ออเดอร์', icon: ShoppingCart, href: '/admin/orders' },
    { label: 'รายการแจ้งโอน', icon: CreditCard, href: '/admin/topup' },
    { label: 'รายงานปัญหา', icon: MessageSquare, href: '/admin/reports' },
    { label: 'ตั้งค่ารับเงิน', icon: Wallet, href: '/admin/bank' },
    { label: 'ข่าวสาร', icon: Newspaper, href: '/admin/news' },
    { label: 'ข้อกำหนด', icon: Settings, href: '/admin/settings' },
];

import { useState } from 'react';
import { ProfileModal } from './ProfileModal';



export function AdminSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <aside className="w-64 min-h-screen bg-[#0a0a0b] border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
            <div className="h-16 flex items-center px-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        A
                    </div>
                    <span className="font-bold text-lg">System Dashboard</span>
                </div>
            </div>

            <div className="p-6 pb-2">
                <button
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-3 mb-6 w-full p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[1px]">
                        <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center font-bold overflow-hidden">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.[0].toUpperCase() || user?.email?.[0].toUpperCase()
                            )}
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{user?.name || user?.email}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs font-mono text-orange-400 mt-0.5">
                            ฿ {user?.credit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                        </p>
                    </div>
                    <Settings className="w-4 h-4 ml-auto text-muted-foreground" />
                </button>
            </div>

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-white/5 mb-2"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        กลับสู่หน้าหลัก
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    ออกจากระบบ
                </Button>
            </div>
        </aside>
    );
}
