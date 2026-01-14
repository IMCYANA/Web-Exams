'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, ShoppingBag, CreditCard, MessageCircle, LogOut, User, Settings, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-black/90 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto h-full px-4 flex items-center justify-between">
                {/* Logo & Search */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity">
                        HopeRay
                    </Link>

                    <div className="hidden md:flex relative w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                        <Input
                            placeholder="ค้นหาสินค้า..."
                            className="bg-white/20 border-white/20 text-white placeholder:text-white/70 pl-10 h-9 rounded-full focus-visible:ring-white/30 hover:bg-white/30 transition-colors"
                        />
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 px-4 backdrop-blur-sm border border-white/5">
                    <Link href="/" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 rounded-full transition-colors">
                        <Home className="h-4 w-4" />
                        หน้าแรก
                    </Link>
                    <Link href="/shop" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 rounded-full transition-colors">
                        <ShoppingBag className="h-4 w-4" />
                        บริการเกมต่างๆ
                    </Link>
                    <Link href="/topup" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 rounded-full transition-colors">
                        <CreditCard className="h-4 w-4" />
                        เติมเงิน
                    </Link>
                    <Link href="/contact" className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20 rounded-full transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        ติดต่อเรา
                    </Link>
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-4">
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                <span className="text-sm font-medium text-orange-400">
                                    ฿ {user.credit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-white/20 hover:ring-white/40 transition-all">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.profileImage} alt={user.email} />
                                            <AvatarFallback className="bg-white text-purple-600 font-bold">
                                                {user.email?.[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none truncate">{user.email}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.role}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>โปรไฟล์</span>
                                    </DropdownMenuItem>
                                    {user.role === 'ADMIN' && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="cursor-pointer w-full flex items-center">
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>System Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>ออกจากระบบ</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                                <Link href="/auth/login">เข้าสู่ระบบ</Link>
                            </Button>
                            <Button asChild className="bg-white text-purple-600 hover:bg-white/90 font-semibold shadow-lg">
                                <Link href="/auth/register">สมัครสมาชิก</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
