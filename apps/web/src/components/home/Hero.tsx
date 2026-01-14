'use client';

import { useState, useEffect } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "ยกระดับการเล่นเกมของคุณ",
        desc: "เข้าถึงคีย์เกมและไอดีเกมพรีเมียมได้ทันที ในราคาสุดคุ้ม",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
        cta: "เริ่มช้อปเลย"
    },
    {
        id: 2,
        title: "ดีลสุดพิเศษ",
        desc: "ข้อเสนอจำกัดเวลาสำหรับเกมดังยอดนิยม ห้ามพลาด!",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
        cta: "ดูดีลทั้งหมด"
    },
    {
        id: 3,
        title: "บริการลูกค้า 24/7",
        desc: "เราพร้อมช่วยเหลือคุณทุกปัญหา ทุกที่ ทุกเวลา",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
        cta: "ติดต่อเรา"
    }
];

export function Hero() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
    const [slides, setSlides] = useState<any[]>([
        {
            id: 1,
            title: "ยกระดับการเล่นเกมของคุณ",
            desc: "เข้าถึงคีย์เกมและไอดีเกมพรีเมียมได้ทันที ในราคาสุดคุ้ม",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
            cta: "เริ่มช้อปเลย"
        },
        {
            id: 2,
            title: "ดีลสุดพิเศษ",
            desc: "ข้อเสนอจำกัดเวลาสำหรับเกมดังยอดนิยม ห้ามพลาด!",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
            cta: "ดูดีลทั้งหมด"
        },
        {
            id: 3,
            title: "บริการลูกค้า 24/7",
            desc: "เราพร้อมช่วยเหลือคุณทุกปัญหา ทุกที่ ทุกเวลา",
            image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
            cta: "ติดต่อเรา"
        }
    ]);

    useEffect(() => {
        import('@/lib/api').then((mod) => {
            mod.default.get('/news').then(res => {
                if (res.data && res.data.length > 0) {
                    const mappedSlides = res.data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        desc: item.content,
                        image: item.image || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
                        cta: "ดูรายละเอียด"
                    }));
                    setSlides(mappedSlides);
                }
            }).catch(err => console.error(err));
        });
    }, []);

    return (
        <section className="relative w-full h-[500px] lg:h-[600px] overflow-hidden bg-black/90">
            <div className="absolute inset-0 z-0" ref={emblaRef}>
                <div className="flex h-full">
                    {slides.map((slide) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
                            <div className="absolute inset-0">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-black/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                            </div>

                            <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-4 md:px-8">
                                <div className="max-w-2xl space-y-6">
                                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-xl animate-in fade-in slide-in-from-bottom-5 duration-700">
                                        {slide.title}
                                    </h1>
                                    <p className="text-lg md:text-2xl text-white/90 font-medium drop-shadow-md animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                                        {slide.desc}
                                    </p>
                                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
                                        <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                                            {slide.cta} <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
