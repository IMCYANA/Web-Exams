import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertCircle, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TopupPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/topup/admin/transactions');
            setTransactions(res.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const pendingCount = transactions.filter(t => t.status === 'PENDING').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">จัดการรายการเติมเงิน</h1>
                    </div>
                    <p className="text-sm text-muted-foreground ml-12">ตรวจสอบและอนุมัติยอดเงินจากลูกค้า</p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-[#18181b] rounded-full border border-white/5">
                    <span className={`w-2 h-2 rounded-full ${pendingCount > 0 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
                    <span className="text-sm">รายการรอตรวจสอบ: <span className="font-bold text-orange-500">{pendingCount}</span> รายการ</span>
                </div>
            </div>

            <Card className="bg-[#18181b] border-white/5">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead>เวลาแจ้ง</TableHead>
                                <TableHead>ผู้ใช้งาน</TableHead>
                                <TableHead>ยอดเงิน</TableHead>
                                <TableHead>ช่องทาง</TableHead>
                                <TableHead>หลักฐาน (SLIP)</TableHead>
                                <TableHead>สถานะ</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">กำลังโหลดข้อมูล...</TableCell>
                                </TableRow>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id} className="border-white/5 hover:bg-white/5">
                                        <TableCell className="text-muted-foreground">
                                            {new Date(tx.createdAt).toLocaleString('th-TH')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white">{tx.user?.name || 'Unknown'}</span>
                                                <span className="text-xs text-muted-foreground">{tx.user?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-green-400 font-bold">
                                            +{tx.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                                {tx.method}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {tx.proofUrl && tx.proofUrl !== 'slip_uploaded' ? (
                                                <a href={`https://developer.easyslip.com/dashboard/transaction/${tx.refNo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline text-xs">
                                                    {tx.refNo} <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {tx.status === 'COMPLETED' ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">สำเร็จ</Badge>
                                            ) : tx.status === 'PENDING' ? (
                                                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20">รอตรวจสอบ</Badge>
                                            ) : (
                                                <Badge variant="destructive">ยกเลิก</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="border-white/5 hover:bg-white/5">
                                    <TableCell colSpan={6} className="text-center h-48 text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                                            <AlertCircle className="h-10 w-10" />
                                            <span>ยังไม่มีรายการแจ้งโอนเข้ามา</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
