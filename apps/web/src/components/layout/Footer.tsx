'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="bg-[#050505] border-t border-white/10 py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Brand & Copyright */}
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <Link href="/" className="text-xl font-bold text-primary tracking-tight">
                        HopeRay
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        © 2024 HopeRay. All rights reserved.
                    </p>
                </div>

                {/* Social Icons */}
                <div className="flex gap-6">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        {/* X Logo */}
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Youtube className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
