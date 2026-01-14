'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Smartphone, Upload, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function TopupPage() {
    const { success, error } = useToast();
    const { user, refreshProfile } = useAuth();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [banks, setBanks] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        api.get('/banks').then(res => setBanks(res.data));
    }, []);

    const [selectedBank, setSelectedBank] = useState<any>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        success('คัดลอกเลขบัญชีแล้ว');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            error('กรุณาแนบสลิปหลักฐาน');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('method', 'BANK_TRANSFER');
        formData.append('file', selectedFile);

        try {
            await api.post('/topup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            success('แจ้งชำระเงินเรียบร้อย กรุณารอตรวจสอบ');

            await refreshProfile();

            setAmount('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err: any) {
            console.error('Upload failed', err);
            error(err.response?.data?.message || 'การแจ้งโอนล้มเหลว');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0b] py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">เติมเงินเข้าระบบ</h1>
                    <p className="text-muted-foreground">เลือกช่องทางการชำระเงินที่สะดวกสำหรับคุณ</p>
                </div>

                <Tabs defaultValue="bank" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 bg-white/5 border border-white/10 h-14 p-1">
                        <TabsTrigger value="bank" className="data-[state=active]:bg-primary data-[state=active]:text-white h-full text-base">
                            <CreditCard className="mr-2 h-5 w-5" /> โอนผ่านธนาคาร
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bank" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Card className="bg-[#18181b] border-white/10 h-full">
                                <CardHeader>
                                    <CardTitle>เลือกช่องทางชำระเงิน</CardTitle>
                                    <CardDescription>กดเลือกบัญชีที่ต้องการโอน</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        {banks.map((bank) => (
                                            <div
                                                key={bank.id}
                                                onClick={() => setSelectedBank(bank)}
                                                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedBank?.id === bank.id
                                                    ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl uppercase ${bank.type === 'PROMPTPAY' ? 'bg-blue-600' : 'bg-green-600'
                                                        }`}>
                                                        {bank.type === 'PROMPTPAY' ? 'PP' : bank.bankName[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-lg text-white">{bank.bankName}</p>
                                                        <p className="text-sm text-muted-foreground">{bank.accountName}</p>
                                                    </div>
                                                    {selectedBank?.id === bank.id && (
                                                        <CheckCircle2 className="text-primary w-6 h-6" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedBank && (
                                        <div className="mt-6 p-4 rounded-lg bg-black/40 border border-white/10 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="text-center mb-4">
                                                <p className="text-muted-foreground text-sm mb-1">{selectedBank.type === 'PROMPTPAY' ? 'พร้อมเพย์' : 'เลขที่บัญชี'}</p>
                                                <div
                                                    onClick={() => handleCopy(selectedBank.accountNumber)}
                                                    className="text-3xl font-mono text-primary font-bold tracking-wider cursor-pointer hover:text-white transition-colors flex items-center justify-center gap-2 group"
                                                >
                                                    {selectedBank.accountNumber}
                                                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-muted-foreground group-hover:bg-white/20">COPY</span>
                                                </div>
                                                <p className="text-white mt-1">{selectedBank.accountName}</p>
                                            </div>

                                            {selectedBank.type === 'PROMPTPAY' && selectedBank.qrCode && (
                                                <div className="flex justify-center mt-4">
                                                    <div className="bg-white p-2 rounded-lg">

                                                        <img src={selectedBank.qrCode} alt="PromptPay QR" className="w-48 h-48 object-contain" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {banks.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            ไม่พบบัญชีธนาคาร
                                        </div>
                                    )}
                                </CardContent>
                            </Card>


                            <Card className="bg-[#18181b] border-white/10 h-full">
                                <CardHeader>
                                    <CardTitle>แจ้งชำระเงิน</CardTitle>
                                    <CardDescription>กรอกข้อมูลหลังจากโอนเงินแล้ว</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>จำนวนเงินที่โอน</Label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="bg-black/20 border-white/10"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>แนบสลิปหลักฐาน</Label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                            />
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${selectedFile ? 'border-green-500 bg-green-500/10' : 'border-white/10 hover:bg-white/5'
                                                    }`}
                                            >
                                                {selectedFile ? (
                                                    <>
                                                        <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                                                        <span className="text-sm text-green-500 font-medium">{selectedFile.name}</span>
                                                        <span className="text-xs text-muted-foreground mt-1">คลิกเพื่อเปลี่ยนรูป</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                                        <span className="text-sm text-muted-foreground">คลิกเพื่ออัพโหลดรูปภาพ</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold" disabled={isLoading}>
                                            {isLoading ? 'กำลังส่งข้อมูล...' : 'แจ้งโอนเงิน'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>


                </Tabs>
            </div>
        </main>
    );
}
