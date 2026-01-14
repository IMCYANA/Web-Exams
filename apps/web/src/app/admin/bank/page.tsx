'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Save, Trash2, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface BankAccount {
    id: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    isActive: boolean;
    type?: string;
    qrCode?: string;
}

export default function BankSettingsPage() {
    const [accounts, setAccounts] = useState<BankAccount[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        type: 'BANK',
        qrCode: ''
    });
    const { success, error } = useToast();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [apiKey, setApiKey] = useState('');
    const [isSavingKey, setIsSavingKey] = useState(false);

    const fetchAccounts = async () => {
        try {
            const [banksRes, settingsRes] = await Promise.all([
                api.get('/admin/banks'),
                api.get('/admin/settings/payment')
            ]);
            setAccounts(banksRes.data);
            if (settingsRes.data && settingsRes.data.bank_slip_api_key) {
                setApiKey(settingsRes.data.bank_slip_api_key);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
            error('โหลดข้อมูลไม่สำเร็จ');
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleSaveApiKey = async () => {
        setIsSavingKey(true);
        try {
            await api.put('/admin/settings/payment', { bank_slip_api_key: apiKey });
            success('บันทึก API Key เรียบร้อย');
        } catch (err) {
            console.error('Failed to save API Key:', err);
            error('บันทึกไม่สำเร็จ');
        } finally {
            setIsSavingKey(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.bankName || !formData.accountName || !formData.accountNumber) return;
        setIsLoading(true);
        try {
            await api.post('/admin/banks', formData);
            setFormData({ bankName: '', accountName: '', accountNumber: '' });
            fetchAccounts();
            success('เพิ่มบัญชีเรียบร้อยแล้ว');
        } catch (err) {
            console.error('Failed to create bank:', err);
            error('เพิ่มบัญชีไม่สำเร็จ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/admin/banks/${deleteId}`);
            fetchAccounts();
            success('ลบบัญชีเรียบร้อยแล้ว');
        } catch (err) {
            console.error('Failed to delete bank:', err);
            error('ลบบัญชีไม่สำเร็จ');
        } finally {
            setDeleteId(null);
        }
    };

    const getBankDetails = (bankName: string) => {
        switch (bankName) {
            case 'ธนาคารกสิกรไทย':
                return { color: 'bg-[#138f2d]', initial: 'KBANK', textColor: 'text-white' };
            case 'ธนาคารไทยพาณิชย์':
                return { color: 'bg-[#4e257b]', initial: 'SCB', textColor: 'text-white' };
            case 'ธนาคารกรุงไทย':
                return { color: 'bg-[#1ba5e1]', initial: 'KTB', textColor: 'text-white' };
            case 'ธนาคารกรุงเทพ':
                return { color: 'bg-[#1e4598]', initial: 'BBL', textColor: 'text-white' };
            case 'TrueMoney Wallet':
                return { color: 'bg-[#ff5c00]', initial: 'TMN', textColor: 'text-white' };
            default:
                return { color: 'bg-gray-700', initial: 'BANK', textColor: 'text-gray-300' };
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">ตั้งค่าการรับเงิน</h1>
                    <p className="text-sm text-muted-foreground">เพิ่มช่องทางการชำระเงินเพื่อให้ลูกค้าโอนเงินเข้ามา (แสดงผลหน้าเติมเงิน)</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-6">
                    <Card className="bg-[#18181b] border-white/5 h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-green-500">
                                <span className="text-lg">+</span> เพิ่มบัญชีใหม่
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>ประเภทบัญชี</Label>
                                <Select
                                    value={formData.bankName === 'PromptPay' ? 'PROMPTPAY' : 'BANK'}
                                    onValueChange={(val) => {
                                        if (val === 'PROMPTPAY') {
                                            setFormData(prev => ({ ...prev, bankName: 'PromptPay', type: 'PROMPTPAY' }));
                                        } else {
                                            setFormData(prev => ({ ...prev, type: 'BANK', bankName: '' }));
                                        }
                                    }}
                                >
                                    <SelectTrigger className="bg-black/20 border-white/10">
                                        <SelectValue placeholder="เลือกประเภท" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BANK">บัญชีธนาคาร</SelectItem>
                                        <SelectItem value="PROMPTPAY">พร้อมเพย์ (PromptPay)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.bankName !== 'PromptPay' && (
                                <div className="space-y-2">
                                    <Label>เลือกธนาคาร / Wallet</Label>
                                    <Select
                                        value={formData.bankName}
                                        onValueChange={(value) => setFormData({ ...formData, bankName: value })}
                                    >
                                        <SelectTrigger className="bg-black/20 border-white/10">
                                            <SelectValue placeholder="เลือกธนาคาร" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</SelectItem>
                                            <SelectItem value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</SelectItem>
                                            <SelectItem value="ธนาคารกรุงไทย">ธนาคารกรุงไทย</SelectItem>
                                            <SelectItem value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ</SelectItem>
                                            <SelectItem value="TrueMoney Wallet">TrueMoney Wallet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>ชื่อบัญชี</Label>
                                <Input
                                    value={formData.accountName}
                                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                    placeholder="เช่น นายสมชาย ขายดี"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{formData.bankName === 'PromptPay' ? 'เบอร์พร้อมเพย์ / เลขบัตร ปชช.' : 'เลขที่บัญชี'}</Label>
                                <Input
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    placeholder="XXX-X-XXXXX-X"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>

                            {formData.bankName === 'PromptPay' && (
                                <div className="space-y-2">
                                    <Label>ลิงก์รูป QR Code (ถ้ามี)</Label>
                                    <Input
                                        value={formData.qrCode || ''}
                                        onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                                        placeholder="https://example.com/qr.png"
                                        className="bg-black/20 border-white/10"
                                    />
                                    <p className="text-xs text-muted-foreground">ใส่ URL ของรูปภาพ QR Code เพื่อให้ลูกค้าสแกน</p>
                                </div>
                            )}

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                <Save className="h-4 w-4" />
                                {isLoading ? 'กำลังบันทึก...' : 'บันทึกบัญชี'}
                            </Button>
                        </CardContent>
                    </Card>


                </div>

                <div className="md:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="w-1 h-4 bg-gray-500 rounded-full"></span>
                        รายการบัญชีที่เปิดใช้งาน
                    </h2>

                    {accounts.length === 0 && (
                        <div className="text-center text-muted-foreground py-10 bg-[#18181b] rounded-lg border border-white/5">
                            ยังไม่มีบัญชีที่เพิ่มไว้
                        </div>
                    )}

                    {accounts.map((acc) => {
                        const bankStyle = getBankDetails(acc.bankName);
                        return (
                            <Card key={acc.id} className="bg-[#18181b] border-white/5">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xs ${bankStyle.color} ${bankStyle.textColor} shadow-lg`}>
                                            {bankStyle.initial}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-semibold text-lg">{acc.bankName}</p>
                                            <p className="text-sm text-gray-400">{acc.accountName}</p>
                                            <p className="text-base font-mono text-blue-400 tracking-wide">{acc.accountNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs border border-green-500/20">
                                            <CheckCircle2 className="h-3 w-3" /> ใช้งานอยู่
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-red-500/10 hover:text-red-500"
                                            onClick={() => setDeleteId(acc.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="ยืนยันการลบบัญชี"
                description="คุณแน่ใจหรือไม่ที่จะลบบัญชีนี้? การกระทำนี้ไม่สามารถย้อนกลับได้ (บัญชีจะถูกปิดการใช้งาน)"
                confirmText="ลบบัญชี"
                variant="danger"
            />
        </div>
    );
}
