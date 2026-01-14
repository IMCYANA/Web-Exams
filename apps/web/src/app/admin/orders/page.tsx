'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ShoppingBag, Search, ShoppingCart, DollarSign } from 'lucide-react';

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold">รายการคำสั่งซื้อ (Orders)</h1>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">จัดการการจัดส่งสินค้าและตรวจสอบยอดขาย</p>
                </div>
                <div className="flex items-center gap-2">
                    <Card className="bg-[#18181b] border-white/5 p-2 px-4 flex items-center gap-3 h-12">
                        <div className="bg-blue-500/20 p-1.5 rounded-full">
                            <ShoppingCart className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold">คำสั่งซื้อรวม</p>
                            <p className="text-sm font-bold">0</p>
                        </div>
                    </Card>
                    <Card className="bg-[#18181b] border-white/5 p-2 px-4 flex items-center gap-3 h-12">
                        <div className="bg-green-500/20 p-1.5 rounded-full">
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold">ยอดขายรวม</p>
                            <p className="text-sm font-bold">฿0</p>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="ค้นหาเลขที่ออเดอร์, ชื่อเกม..."
                    className="pl-10 bg-black/20 border-white/10"
                />
            </div>

            <Card className="bg-[#18181b] border-white/5">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead>ORDER ID</TableHead>
                                <TableHead>สินค้า</TableHead>
                                <TableHead>แต่งตัว</TableHead>
                                <TableHead>ลูกค้า</TableHead>
                                <TableHead>วันที่สั่งซื้อ</TableHead>
                                <TableHead>สถานะการส่ง</TableHead>
                                <TableHead className="text-right">ดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-white/5 hover:bg-white/5">
                                <TableCell colSpan={7} className="text-center h-48 text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                                        <ShoppingBag className="h-10 w-10" />
                                        <span>ไม่พบรายการคำสั่งซื้อ</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
