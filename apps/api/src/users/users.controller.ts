import { Controller, Get, Body, Put, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        try {

            const user = await this.usersService.findById(req.user.userId);
            if (!user) {
                console.warn(`Profile not found for userId: ${req.user.userId}`);
                return null;
            }
            const { passwordHash, ...result } = user;
            return {
                ...result,
                credit: result.credit ? Number(result.credit) : 0
            };
        } catch (error) {
            console.error('Error in getProfile:', error);
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    async updateProfile(@Request() req: any, @Body() body: UpdateUserDto) {
        const user = await this.usersService.update(req.user.userId, body);
        const { passwordHash, ...result } = user;
        return result;
    }
}
