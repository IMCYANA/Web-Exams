import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const [totalUsers, totalRevenue, totalOrders, recentTopups] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.topupTransaction.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { amount: true }
            }),
            this.prisma.order.count({ where: { status: 'COMPLETED' } }),
            this.prisma.topupTransaction.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true },
                include: { user: true },
            })
        ]);

        return {
            totalUsers,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalOrders,
            recentActivity: recentTopups.map(t => ({
                id: t.id,
                user: t.user.name || t.user.email,
                type: 'TOPUP',
                amount: t.amount,
                time: t.createdAt
            }))
        };
    }

    async getChartData() {

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const topups = await this.prisma.topupTransaction.groupBy({
            by: ['createdAt'],
            where: {
                status: 'COMPLETED',
                createdAt: { gte: startOfMonth }
            },
            _sum: { amount: true }
        });


        const dailyMap = new Map<string, number>();
        topups.forEach(t => {
            const day = t.createdAt.getDate().toString();
            const current = dailyMap.get(day) || 0;
            dailyMap.set(day, current + (t._sum.amount ? Number(t._sum.amount) : 0));
        });


        const chartData = [];
        for (let i = 1; i <= 31; i++) {
            chartData.push({
                name: i.toString(),
                total: dailyMap.get(i.toString()) || 0
            });
        }
        return chartData;
    }
}
