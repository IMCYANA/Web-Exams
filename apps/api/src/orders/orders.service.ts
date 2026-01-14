import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private eventEmitter: EventEmitter2,
    ) { }

    async createOrder(userId: string, gameId: string) {
        const game = await this.prisma.game.findUnique({ where: { id: gameId } });
        if (!game) throw new NotFoundException('Game not found');

        return this.prisma.$transaction(async (tx) => {

            const stockItems = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM "GameAccount"
        WHERE "gameId" = ${gameId}::uuid AND "isSold" = false
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      `;

            if (stockItems.length === 0) {
                throw new BadRequestException('Out of stock');
            }

            const accountId = stockItems[0].id;


            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount: game.price,
                    status: 'COMPLETED',
                    paymentId: 'mock_pay_' + Date.now(),
                },
            });


            await tx.gameAccount.update({
                where: { id: accountId },
                data: { isSold: true, orderId: order.id },
            });

            this.eventEmitter.emitAsync('order.created', {
                orderId: order.id,
                total: Number(game.price),
                userId
            });

            return order;
        });
    }

    async getUserOrders(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}
