'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';
import { User, Lock, Mail } from 'lucide-react';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, refreshProfile } = useAuth();
    const { success, error } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
        profileImage: '',
    });

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.name || '',
                phoneNumber: user.phoneNumber || '',
                email: user.email || '',
                password: '',
                profileImage: user.profileImage || '',
            });
            fetchProfile();
        }
    }, [isOpen, user]);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/users/profile');
            setFormData(prev => ({
                ...prev,
                name: data.name || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                profileImage: data.profileImage || ''
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const updateData: any = {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                profileImage: formData.profileImage,
            };
            if (formData.password) {
                updateData.password = formData.password;
            }

            const { data } = await api.put('/users/profile', updateData);

            success('อัพเดทโปรไฟล์เรียบร้อย');
            await refreshProfile();
            onClose();
        } catch (err) {
            console.error(err);
            error('อัพเดทไม่สำเร็จ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#18181b] border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" /> แก้ไขโปรไฟล์
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex gap-4 items-start">
                        <div className="w-20 h-20 rounded-full bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {formData.profileImage ? (
                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-8 w-8 text-muted-foreground" />
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label>URL รูปโปรไฟล์</Label>
                            <Input
                                value={formData.profileImage}
                                onChange={e => setFormData({ ...formData, profileImage: e.target.value })}
                                className="bg-black/20 border-white/10"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>ชื่อจริง</Label>
                            <Input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="bg-black/20 border-white/10"
                                placeholder="ชื่อของคุณ"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>เบอร์โทรศัพท์</Label>
                            <Input
                                value={formData.phoneNumber}
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="bg-black/20 border-white/10"
                                placeholder="081-xxxxxxx"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>อีเมล</Label>
                        <Input
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="bg-black/20 border-white/10"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>เปลี่ยนรหัสผ่าน (เว้นว่างหากไม่เปลี่ยน)</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="pl-10 bg-black/20 border-white/10"
                                placeholder="รหัสผ่านใหม่"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">ยกเลิก</Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
