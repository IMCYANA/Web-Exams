import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('admin/settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get('terms')
    findTerms() {
        return this.settingsService.findOne('terms_of_service');
    }

    @Put('terms')
    updateTerms(@Body() body: { value: string }) {
        return this.settingsService.update('terms_of_service', body.value);
    }

    @Get('contact')
    getContact() {
        return this.settingsService.getContactInfo();
    }

    @Put('contact')
    updateContact(@Body() body: { address: string; phone: string; email: string }) {
        return this.settingsService.updateContactInfo(body);
    }

    @Get('payment')
    getPaymentSettings() {
        return this.settingsService.getPaymentSettings();
    }

    @Put('payment')
    updatePaymentSettings(@Body() body: { bank_slip_api_key: string }) {
        return this.settingsService.updatePaymentSettings(body.bank_slip_api_key);
    }
}
