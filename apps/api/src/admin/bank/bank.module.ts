import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { PublicBankController } from './public-bank.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [BankController, PublicBankController],
    providers: [BankService],
})
export class BankModule { }
