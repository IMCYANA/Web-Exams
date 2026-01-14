'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wallet, ArrowUpRight } from 'lucide-react';

export default function WalletPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">กระเป๋าเงิน (Wallet)</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-[#18181b] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">ยอดเงินที่ถอนได้</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$0.00</div>
                    </CardContent>
                </Card>
                <Card className="bg-[#18181b] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">รอตรวจสอบ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-500">$0.00</div>
                    </CardContent>
                </Card>
                <Card className="bg-[#18181b] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">ถอนแล้วทั้งหมด</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-500">$0.00</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-[#18181b] border-white/5">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>ประวัติการถอนเงิน</CardTitle>
                        <CardDescription>รายการแจ้งถอนล่าสุด</CardDescription>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        แจ้งถอนระเงิน
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48 text-muted-foreground border-2 border-dashed border-white/10 rounded-lg">
                        ไม่มีประวัติการถอน
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
