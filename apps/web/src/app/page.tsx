'use client';

import { Hero } from "@/components/home/Hero";
import { ProductGrid } from "@/components/home/ProductGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0b] flex flex-col">
      <Hero />
      <ProductGrid />
    </main>
  );
}
