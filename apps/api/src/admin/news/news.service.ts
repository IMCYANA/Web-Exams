import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
    constructor(private prisma: PrismaService) { }

    create(createNewsDto: CreateNewsDto) {
        return this.prisma.announcement.create({
            data: createNewsDto,
        });
    }

    findAll() {
        return this.prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    remove(id: string) {
        return this.prisma.announcement.delete({
            where: { id },
        });
    }

    updateStatus(id: string, isActive: boolean) {
        return this.prisma.announcement.update({
            where: { id },
            data: { isActive },
        });
    }
}
