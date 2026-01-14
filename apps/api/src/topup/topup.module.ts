import { Module } from '@nestjs/common';
import { TopupService } from './topup.service';
import { TopupController } from './topup.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsService } from '../admin/settings/settings.service';

@Module({
  imports: [PrismaModule],
  controllers: [TopupController],
  providers: [TopupService, SettingsService],
})
export class TopupModule { }
