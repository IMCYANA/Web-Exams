import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async update(key: string, value: string) {
        return this.prisma.systemSettings.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

    async findOne(key: string) {
        const setting = await this.prisma.systemSettings.findUnique({
            where: { key },
        });
        return { value: setting ? setting.value : '' };
    }

    async getContactInfo() {
        const keys = ['contact_address', 'contact_phone', 'contact_email'];
        const settings = await this.prisma.systemSettings.findMany({
            where: { key: { in: keys } },
        });

        const result = {
            contact_address: '',
            contact_phone: '',
            contact_email: ''
        };

        settings.forEach(s => {
            if (s.key in result) result[s.key as keyof typeof result] = s.value;
        });

        return result;
    }

    async updateContactInfo(data: { address: string; phone: string; email: string }) {
        await this.update('contact_address', data.address);
        await this.update('contact_phone', data.phone);
        await this.update('contact_email', data.email);
        return this.getContactInfo();
    }

    async getPaymentSettings() {
        const setting = await this.prisma.systemSettings.findUnique({
            where: { key: 'bank_slip_api_key' },
        });
        return { bank_slip_api_key: setting ? setting.value : '' };
    }

    async updatePaymentSettings(key: string) {
        return this.update('bank_slip_api_key', key);
    }
}
