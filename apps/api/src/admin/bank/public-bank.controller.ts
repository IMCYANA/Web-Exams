import { Controller, Get } from '@nestjs/common';
import { BankService } from './bank.service';

@Controller('banks')
export class PublicBankController {
    constructor(private readonly bankService: BankService) { }

    @Get()
    findAll() {
        return this.bankService.findAll();
    }
}
