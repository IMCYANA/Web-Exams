import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { GamesModule } from './games/games.module';
import { OrdersModule } from './orders/orders.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { BankModule } from './admin/bank/bank.module';
import { NewsModule } from './admin/news/news.module';
import { SettingsModule } from './admin/settings/settings.module';
import { TopupModule } from './topup/topup.module';
import { DashboardModule } from './admin/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    PrismaModule,
    GamesModule,
    OrdersModule,
    WebhooksModule,
    BankModule,
    NewsModule,
    SettingsModule,
    TopupModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
