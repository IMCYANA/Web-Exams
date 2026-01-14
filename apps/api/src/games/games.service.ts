import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { encrypt } from '../utils/encryption';
import { Prisma, Game } from '@prisma/client';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateGameDto): Promise<Game> {
        let slug = data.title.toLowerCase()
            .replace(/[^\w\u0E00-\u0E7F\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');


        const exists = await this.prisma.game.findUnique({ where: { slug } });
        if (exists) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
        }

        const { options, ...gameData } = data;

        return this.prisma.game.create({
            data: {
                ...gameData,
                slug,
                options: options && options.length > 0 ? {
                    create: options.map(opt => ({
                        name: opt.name,
                        price: opt.price,
                        image: opt.image
                    }))
                } : undefined
            },
            include: {
                options: true
            }
        });
    }

    async findAll(): Promise<Game[]> {
        return this.prisma.game.findMany({ where: { isActive: true } });
    }

    async findOne(id: string): Promise<Game | null> {
        return this.prisma.game.findUnique({ where: { id } });
    }

    async addStock(gameId: string, accounts: { username?: string; password?: string; additional?: any }[]) {
        const data = accounts.map(acc => ({
            gameId,
            username: encrypt(acc.username || ''),
            password: encrypt(acc.password || ''),
            additionalData: acc.additional,
            addedBy: 'Admin',
        }));

        return this.prisma.gameAccount.createMany({ data });
    }

    async delete(id: string) {
        return this.prisma.game.update({ where: { id }, data: { isActive: false } });
    }
}
