import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhooksService {
    private readonly logger = new Logger(WebhooksService.name);
    private webhookUrl: string;

    constructor(private configService: ConfigService) {
        this.webhookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL') || '';
    }

    @OnEvent('user.login')
    async handleUserLogin(payload: { email: string, ip: string }) {
        this.sendNotification({
            title: '🔐 User Login',
            description: `User **${payload.email}** logged in from IP: \`${payload.ip}\``,
            color: 0x00FF00,
            timestamp: new Date().toISOString(),
        });
    }

    @OnEvent('order.created')
    async handleOrderCreated(payload: { orderId: string, total: number, userId: string }) {
        this.sendNotification({
            title: '💰 New Order',
            description: `Order **${payload.orderId}** created by user <${payload.userId}>.\n**Total:** $${payload.total}`,
            color: 0xFFAA00,
            timestamp: new Date().toISOString(),
        });
    }

    private async sendNotification(embed: any) {
        if (!this.webhookUrl) {
            this.logger.warn('Discord Webhook URL not configured');
            return;
        }

        try {
            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] }),
            });
        } catch (e) {
            this.logger.error('Failed to send Discord webhook', e);
        }
    }
}
