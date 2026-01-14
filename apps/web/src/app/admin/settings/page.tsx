'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function SettingsPage() {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { success, error } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get('/admin/settings/terms');
                if (data && data.value) {
                    setContent(data.value);
                } else {
                    setContent(`1. ขอบเขตการให้บริการ
- ทางร้านจำหน่ายไอดีเกมประเภท "ดองเพชร" (Starter Account)...`);
                }
            } catch (err) {
                console.error('Failed to fetch settings:', err);
                error('โหลดข้อมูลไม่สำเร็จ');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put('/admin/settings/terms', { value: content });
            success('บันทึกข้อมูลเรียบร้อยแล้ว');
        } catch (err) {
            console.error('Failed to save settings:', err);
            error('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">ข้อกำหนดการใช้งาน (Terms of Service)</h1>
                    <p className="text-sm text-muted-foreground">กำหนดกติกาการซื้อขาย การรับประกัน และความรับผิดชอบ เพื่อความเข้าใจที่ตรงกันกับลูกค้า</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 h-[calc(100vh-200px)] min-h-[600px]">
                <Card className="bg-[#18181b] border-white/5 flex flex-col h-full">
                    <CardHeader className="pb-3 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2 text-base text-green-500">
                            <FileText className="h-4 w-4" /> แก้ไขเนื้อหา
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 flex flex-col gap-4">
                        <Textarea
                            className="flex-1 bg-black/20 border-white/10 font-mono text-sm leading-relaxed resize-none p-4"
                            placeholder="พิมพ์ข้อกำหนดที่นี่..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            onClick={handleSave}
                            disabled={isSaving || isLoading}
                        >
                            <Save className="h-4 w-4" />
                            {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-[#18181b] border-white/5 flex flex-col h-full">
                    <CardHeader className="pb-3 border-b border-white/5">
                        <CardTitle className="flex items-center gap-2 text-base text-gray-400">
                            ตัวอย่างการแสดงผล (Preview)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        <div className="prose prose-invert max-w-none prose-sm whitespace-pre-wrap">
                            {content}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
