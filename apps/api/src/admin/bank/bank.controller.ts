import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';

@Controller('admin/banks')
export class BankController {
    constructor(private readonly bankService: BankService) { }

    @Post()
    create(@Body() createBankDto: CreateBankDto) {
        return this.bankService.create(createBankDto);
    }

    @Get()
    findAll() {
        return this.bankService.findAll();
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bankService.remove(id);
    }
}
