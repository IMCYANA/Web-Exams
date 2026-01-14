import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(email: string, password: string, role: Role = 'USER'): Promise<User> {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        try {
            return await this.prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    role,
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }
    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: { name?: string; email?: string; password?: string; phoneNumber?: string; profileImage?: string }): Promise<User> {
        const updateData: any = { ...data };
        delete updateData.password;

        if (data.password) {
            const salt = await bcrypt.genSalt();
            updateData.passwordHash = await bcrypt.hash(data.password, salt);
        }

        try {
            return await this.prisma.user.update({
                where: { id },
                data: updateData,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Email already exists');
                }
                if (error.code === 'P2025') {
                    throw new NotFoundException('User not found');
                }
            }
            throw error;
        }
    }
}

