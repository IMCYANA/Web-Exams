import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { GamesService } from './games.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateGameDto } from './dto/create-game.dto';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) { }

    @Get()
    findAll() {
        return this.gamesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.gamesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    create(@Body() body: CreateGameDto) {
        return this.gamesService.create(body);
    }

    @Post(':id/stock')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    addStock(@Param('id') id: string, @Body() body: any[]) {
        return this.gamesService.addStock(id, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    delete(@Param('id') id: string) {
        return this.gamesService.delete(id);
    }
}
