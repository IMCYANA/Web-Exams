import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';

@Controller('admin/news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    @Post()
    create(@Body() createNewsDto: CreateNewsDto) {
        return this.newsService.create(createNewsDto);
    }

    @Get()
    findAll() {
        return this.newsService.findAll();
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.newsService.remove(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
        return this.newsService.updateStatus(id, isActive);
    }
}
