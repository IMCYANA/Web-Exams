'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
    const { success } = useToast();
    const [info, setInfo] = useState({
        contact_address: '123 Gaming Street, Digital City, Cloud District, 99999',
        contact_phone: '+66 99-999-9999',
        contact_email: 'support@hoperay.com'
    });

    useEffect(() => {
        api.get('/system-settings').then(res => {
            if (res.data) {
                setInfo(prev => ({
                    contact_address: res.data.contact_address || prev.contact_address,
                    contact_phone: res.data.contact_phone || prev.contact_phone,
                    contact_email: res.data.contact_email || prev.contact_email
                }));
            }
        }).catch(err => console.error(err));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        success('ส่งข้อความเรียบร้อย เราจะติดต่อกลับโดยเร็วที่สุด');
    };

    return (
        <main className="min-h-screen bg-[#0a0a0b] py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">ติดต่อเรา</h1>
                    <p className="text-muted-foreground">มีคำถามหรือข้อสงสัย? ทีมงานพร้อมช่วยเหลือตลอด 24 ชั่วโมง</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card className="bg-[#18181b] border-white/10">
                            <CardHeader>
                                <CardTitle>ช่องทางติดต่อ</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">ที่อยู่บริษัท</h3>
                                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed whitespace-pre-line">
                                            {info.contact_address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">เบอร์โทรศัพท์</h3>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {info.contact_phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">อีเมล</h3>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {info.contact_email}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="rounded-xl overflow-hidden border border-white/10 h-[300px] bg-white/5">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15502.532395914655!2d100.52843795!3d13.74088995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e299313437c763%3A0xc6f332c943147814!2sSiam%20Paragon!5e0!3m2!1sen!2sth!4v1652758296996!5m2!1sen!2sth"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    <Card className="bg-[#18181b] border-white/10">
                        <CardHeader>
                            <CardTitle>ส่งข้อความถึงเรา</CardTitle>
                            <CardDescription>กรอกข้อมูลด้านล่างเพื่อติดต่อทีมงาน</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>ชื่อ</Label>
                                        <Input placeholder="ชื่อของคุณ" className="bg-black/20 border-white/10" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>นามสกุล</Label>
                                        <Input placeholder="นามสกุล" className="bg-black/20 border-white/10" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>อีเมล</Label>
                                    <Input type="email" placeholder="name@example.com" className="bg-black/20 border-white/10" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>หัวข้อเรื่อง</Label>
                                    <Input placeholder="เลือกหัวข้อเรื่อง..." className="bg-black/20 border-white/10" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>ข้อความ</Label>
                                    <Textarea placeholder="พิมพ์ข้อความของคุณที่นี่..." className="bg-black/20 border-white/10 min-h-[150px]" required />
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                                    <Send className="w-4 h-4 mr-2" /> ส่งข้อความ
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
