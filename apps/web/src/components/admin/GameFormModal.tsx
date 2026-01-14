'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';
import { Package, Link as LinkIcon, DollarSign, Trash2 } from 'lucide-react';

interface GameFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function GameFormModal({ isOpen, onClose, onSuccess }: GameFormModalProps) {
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Starter',
        imageUrl: '',
        detailImageUrl: '',
        description: '',
        price: '',
        options: [] as { name: string; price: string; image: string }[]
    });

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { name: '', price: '', image: '' }]
        });
    };

    const updateOption = (index: number, field: string, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setFormData({ ...formData, options: newOptions });
    };

    const removeOption = (index: number) => {
        const newOptions = [...formData.options];
        newOptions.splice(index, 1);
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async () => {
        if (!formData.title) return;

        setIsLoading(true);
        try {
            await api.post('/games', {
                ...formData,
                price: parseFloat(formData.price || '0'),
                options: formData.options.map(opt => ({
                    name: opt.name,
                    price: parseFloat(opt.price || '0'),
                    image: opt.image
                }))
            });
            success('เพิ่มเกมและตัวเลือกเรียบร้อยแล้ว');
            setFormData({ title: '', category: 'Starter', imageUrl: '', detailImageUrl: '', description: '', price: '', options: [] });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            error('เพิ่มเกมไม่สำเร็จ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#18181b] border-white/10 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" /> เพิ่มเกมใหม่
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>ชื่อเกม</Label>
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="bg-black/20 border-white/10"
                                placeholder="เช่น Genshin Impact"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>หมวดหมู่</Label>
                            <Input
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="bg-black/20 border-white/10"
                                placeholder="Starter, ID ผืน, ฯลฯ"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>URL ปกเกม</Label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="pl-10 bg-black/20 border-white/10"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>URL ตารางเรท/รายละเอียด</Label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={formData.detailImageUrl}
                                    onChange={e => setFormData({ ...formData, detailImageUrl: e.target.value })}
                                    className="pl-10 bg-black/20 border-white/10"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>รายละเอียดเพิ่มเติม</Label>
                        <Textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="bg-black/20 border-white/10 min-h-[80px]"
                            placeholder="รายละเอียดเกี่ยวกับสินค้า..."
                        />
                    </div>

                    <div className="border-t border-white/10 pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-base font-semibold text-green-500">ตัวเลือกสินค้า (Options)</Label>
                            <Button size="sm" variant="outline" onClick={addOption} className="h-8 border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400">
                                + เพิ่มตัวเลือก
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {formData.options.length === 0 && (
                                <div className="text-center text-sm text-muted-foreground p-4 border border-dashed border-white/10 rounded-lg">
                                    ยังไม่มีตัวเลือกสินค้า
                                </div>
                            )}
                            {formData.options.map((opt, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-start bg-black/20 p-3 rounded-lg border border-white/5">
                                    <div className="col-span-5 space-y-1">
                                        <Label className="text-xs">ชื่อตัวเลือก</Label>
                                        <Input
                                            value={opt.name}
                                            onChange={e => updateOption(index, 'name', e.target.value)}
                                            placeholder="Set A..."
                                            className="h-8 text-sm bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="col-span-3 space-y-1">
                                        <Label className="text-xs">ราคา</Label>
                                        <Input
                                            type="number"
                                            value={opt.price}
                                            onChange={e => updateOption(index, 'price', e.target.value)}
                                            placeholder="0"
                                            className="h-8 text-sm bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="col-span-3 space-y-1">
                                        <Label className="text-xs">รูป (URL)</Label>
                                        <Input
                                            value={opt.image}
                                            onChange={e => updateOption(index, 'image', e.target.value)}
                                            placeholder="https://..."
                                            className="h-8 text-sm bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="col-span-1 flex items-end h-full pb-1">
                                        <Button variant="ghost" size="icon" onClick={() => removeOption(index)} className="h-8 w-8 text-red-500 hover:bg-red-500/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">ยกเลิก</Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? 'กำลังบันทึก...' : 'เพิ่มเกม'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
