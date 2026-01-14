'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { ShoppingBag, DollarSign, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';



import api from '@/lib/api';

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string, icon: any, colorClass: string }) => (
    <Card className="bg-[#18181b] border-white/5 relative overflow-hidden">
        <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="text-2xl font-bold">{value}</div>
            </div>
            <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
                <Icon className={`h-5 w-5 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
        </CardContent>
    </Card>
);

export default function AdminDashboard() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({ totalRevenue: 0, totalSales: 0, totalUsers: 0 });
    const [chartData, setChartData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
            router.push('/auth/login');
            return;
        }

        if (isAuthenticated && user?.role === 'ADMIN') {
            const fetchData = async () => {
                try {
                    const [statsRes, chartRes] = await Promise.all([
                        api.get('/admin/dashboard/stats'),
                        api.get('/admin/dashboard/chart')
                    ]);
                    setStats({
                        totalRevenue: statsRes.data.totalRevenue,
                        totalSales: statsRes.data.totalOrders,
                        totalUsers: statsRes.data.totalUsers
                    });
                    setRecentActivity(statsRes.data.recentActivity);
                    setChartData(chartRes.data);
                } catch (error) {
                    console.error('Failed to fetch dashboard data', error);
                }
            };
            fetchData();
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Button variant="outline" size="sm" className="text-xs">
                    ข้อมูลเชิงลึกจากระบบ
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="จำนวนการขาย (รายการ)"
                    value={stats.totalSales.toString()}
                    icon={ShoppingBag}
                    colorClass="bg-blue-500 text-blue-500"
                />
                <StatCard
                    title="รายได้ทั้งหมด (บาท)"
                    value={`฿${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="bg-green-500 text-green-500"
                />
                <StatCard
                    title="จำนวน User"
                    value={stats.totalUsers.toString()}
                    icon={Users}
                    colorClass="bg-purple-500 text-purple-500"
                />
            </div>

            {/* Chart Section */}
            <Card className="bg-[#18181b] border-white/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-4">
                        <CardTitle className="text-base font-semibold">สถิติรายได้ (เดือนนี้)</CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs bg-primary/10 text-primary">รายเดือน</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#666"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#333', strokeWidth: 1 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 0 }}
                                    activeDot={{ r: 6, fill: '#10b981' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity Table */}
            <Card className="bg-[#18181b] border-white/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-4">
                        <CardTitle className="text-base font-semibold">รายการล่าสุด (Topup)</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-left">ลูกค้า</TableHead>
                                <TableHead className="text-center">รายการ</TableHead>
                                <TableHead className="text-center">ยอดเงิน</TableHead>
                                <TableHead className="text-right">เวลา</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentActivity.length > 0 ? (
                                recentActivity.map((item: any) => (
                                    <TableRow key={item.id} className="border-white/5 hover:bg-white/5">
                                        <TableCell className="text-left font-medium">{item.user}</TableCell>
                                        <TableCell className="text-center">
                                            <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs border border-green-500/20">
                                                เติมเงินสำเร็จ
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-green-400">+{item.amount}</TableCell>
                                        <TableCell className="text-right text-muted-foreground text-xs">
                                            {new Date(item.time).toLocaleString('th-TH')}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="border-white/5 hover:bg-white/5">
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        ยังไม่มีรายการเกิดขึ้น
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
