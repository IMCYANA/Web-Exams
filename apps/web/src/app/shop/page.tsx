'use client';

import { ProductGrid } from "@/components/home/ProductGrid";

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0b] py-10">
            <div className="container mx-auto px-4 mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">บริการเกมทั้งหมด</h1>
                <p className="text-muted-foreground">เลือกซื้อไอดีเกมและคีย์เกมคุณภาพเยี่ยมจากเรา</p>
            </div>

            {/* Reuse the Product Grid but potentially we could pass props to hide the internal header if needed, 
                but for now let's just render it. The internal header of ProductGrid says "บริการเกมทั้งหมด" too, 
                so maybe we wrap it or just let ProductGrid handle it. 
                Actually, ProductGrid has its own container and header. 
                Let's use ProductGrid directly but maybe we can make ProductGrid header optional later if needed.
                For now, simple integration.
            */}
            <ProductGrid />
        </main>
    );
}
