import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Request() req: any, @Body('gameId') gameId: string) {
        return this.ordersService.createOrder(req.user.userId, gameId);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    findMyOrders(@Request() req: any) {
        return this.ordersService.getUserOrders(req.user.userId);
    }
}
