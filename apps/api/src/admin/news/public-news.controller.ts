import { Controller, Get } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class PublicNewsController {
    constructor(private readonly newsService: NewsService) { }

    @Get()
    findAll() {
        return this.newsService.findAll();
    }
}
