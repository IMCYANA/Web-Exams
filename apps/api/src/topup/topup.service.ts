
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopupDto } from './dto/topup.dto';
import { SettingsService } from '../admin/settings/settings.service';
import * as crypto from 'crypto';

@Injectable()
export class TopupService {
  constructor(
    private prisma: PrismaService,
    private settingsService: SettingsService
  ) {}

  async create(userId: string, dto: CreateTopupDto, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('กรุณาแนบสลิปหลักฐานการโอนเงิน');
    }

    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // Verify duplicate by hash
    const existingByHash = await this.prisma.topupTransaction.findFirst({
      where: {
        fileHash: fileHash,
        status: { in: ['COMPLETED', 'PENDING'] }
      }
    });

    if (existingByHash) {
      throw new BadRequestException('สลิปนี้ถูกใช้งานไปแล้ว (Duplicate Slip)');
    }

    // Manual verification flow - Status PENDING
    try {
      const topupTx = await this.prisma.topupTransaction.create({
        data: {
          userId,
          amount: Number(dto.amount) || 0,
          method: dto.method,
          status: 'PENDING',
          proofUrl: '', 
          refNo: `MANUAL_${Date.now()}`,
          fileHash: fileHash,
          failReason: null
        }
      });
      
      return topupTx;

    } catch (error: any) {
       throw new BadRequestException('เกิดข้อผิดพลาดในการเติมเงิน กรุณาลองใหม่อีกครั้ง');
    }
  }

  async getUserBalance(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { credit: true }
    });
    return Number(user?.credit) || 0;
  }

  async findAll() {
    return this.prisma.topupTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, email: true, name: true } } }
    });
  }
}
