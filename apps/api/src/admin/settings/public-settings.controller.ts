import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('system-settings')
export class PublicSettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    getSettings() {
        return this.settingsService.getContactInfo();
    }
}
