'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">จัดการรายงานปัญหา (Reports)</h1>
                    </div>
                    <p className="text-sm text-muted-foreground ml-12">ข้อความจากหน้า "ติดต่อเรา" หรือการแจ้งปัญหาจากผู้ใช้</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 gap-2 text-orange-500 border-orange-500/20 bg-orange-500/10 hover:bg-orange-500/20">
                        รอตรวจสอบ: 0
                    </Button>
                    <Button variant="outline" className="h-9 gap-2 text-green-500 border-green-500/20 bg-green-500/10 hover:bg-green-500/20">
                        แก้ไขแล้ว: 0
                    </Button>
                </div>
            </div>

            <Card className="bg-[#18181b] border-white/5">
                <CardContent className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
                    <div className="bg-white/5 p-4 rounded-full mb-4">
                        <FileText className="h-8 w-8 opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">ยังไม่มีรายการแจ้งปัญหา</h3>
                    <p className="text-sm opacity-70">เมื่อลูกค้าส่งข้อความผ่านหน้า Contact Us รายการจะปรากฏที่นี่</p>
                </CardContent>
            </Card>
        </div>
    );
}
