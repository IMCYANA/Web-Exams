'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Newspaper, Save, Trash2, Eye, Link as LinkIcon } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface NewsItem {
    id: string;
    title: string;
    content: string;
    image?: string;
    createdAt: string;
    isActive: boolean;
}

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: ''
    });
    const { success, error } = useToast();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchNews = async () => {
        try {
            const { data } = await api.get('/admin/news');
            setNews(data);
        } catch (err) {
            console.error('Failed to fetch news:', err);
            error('โหลดข่าวไม่สำเร็จ');
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) return;
        setIsLoading(true);
        try {
            await api.post('/admin/news', formData);
            setFormData({ title: '', content: '', image: '' });
            fetchNews();
            success('โพสต์ประกาศเรียบร้อยแล้ว');
        } catch (err) {
            console.error('Failed to create news:', err);
            error('โพสต์ข่าวไม่สำเร็จ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/admin/news/${deleteId}`);
            fetchNews();
            success('ลบประกาศเรียบร้อยแล้ว');
        } catch (err) {
            console.error('Failed to delete news:', err);
            error('ลบประกาศไม่สำเร็จ');
        } finally {
            setDeleteId(null);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await api.patch(`/admin/news/${id}/status`, { isActive: !currentStatus });
            fetchNews();
            success(currentStatus ? 'จัดเก็บประกาศแล้ว' : 'เผยแพร่ประกาศแล้ว');
        } catch (err) {
            console.error('Failed to update status:', err);
            error('อัพเดทสถานะไม่สำเร็จ');
        }
    };

    return (
        <div className="space-y-6">
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="ลบประกาศ?"
                description="คุณต้องการลบประกาศนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้"
                confirmText="ลบทันที"
            />            <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                    <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">จัดการข่าวสาร / ประกาศ</h1>
                    <p className="text-sm text-muted-foreground">โพสต์แจ้งเตือน โปรโมชั่น หรือประกาศสำคัญให้ลูกค้าเห็นที่หน้าแรก</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-[#18181b] border-white/5 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-green-500">
                            <span className="text-lg">+</span> สร้างประกาศใหม่
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>หัวข้อประกาศ</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="เช่น แจ้งปิดปรับปรุง, โปรโมชั่น..."
                                className="bg-black/20 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>เนื้อหา</Label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="รายละเอียด..."
                                className="bg-black/20 border-white/10 min-h-[120px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>URL รูปภาพ (ถ้ามี)</Label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                    className="pl-10 bg-black/20 border-white/10"
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            <Save className="h-4 w-4" />
                            {isLoading ? 'กำลังโพสต์...' : 'โพสต์ประกาศ'}
                        </Button>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="w-1 h-4 bg-gray-500 rounded-full"></span>
                        รายการประกาศทั้งหมด
                    </h2>

                    {news.length === 0 && (
                        <div className="text-center text-muted-foreground py-10 bg-[#18181b] rounded-lg border border-white/5">
                            ยังไม่มีประกาศ
                        </div>
                    )}

                    {news.map((item) => (
                        <Card key={item.id} className={`bg-[#18181b] border-white/5 overflow-hidden ${!item.isActive ? 'opacity-60' : ''}`}>
                            <CardContent className="p-4 flex gap-4">
                                <div className="w-32 h-20 bg-black/40 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-muted-foreground">No Image</span>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                                            <span className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1">{item.content}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`text-xs font-medium ${item.isActive ? 'text-green-500' : 'text-gray-500'}`}>
                                            สถานะ: {item.isActive ? 'เผยแพร่' : 'จัดเก็บ'}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`h-7 text-xs gap-1 ${item.isActive ? 'text-amber-500 hover:text-amber-400' : 'text-green-500 hover:text-green-400'}`}
                                                onClick={() => handleToggleStatus(item.id, item.isActive)}
                                            >
                                                {item.isActive ? (
                                                    <>
                                                        <Eye className="h-3 w-3" /> จัดเก็บ
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-3 w-3" /> เผยแพร่
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs gap-1 hover:text-red-500"
                                                onClick={() => setDeleteId(item.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
