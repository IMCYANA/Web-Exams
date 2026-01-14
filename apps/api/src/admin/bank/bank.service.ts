import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';

@Injectable()
export class BankService {
    constructor(private prisma: PrismaService) { }

    create(createBankDto: CreateBankDto) {
        return this.prisma.bankAccount.create({
            data: createBankDto,
        });
    }

    findAll() {
        return this.prisma.bankAccount.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    remove(id: string) {
        return this.prisma.bankAccount.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
