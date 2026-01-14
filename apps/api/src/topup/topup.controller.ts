import { Controller, Post, Body, UseGuards, Request, Get, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TopupService } from './topup.service';
import { CreateTopupDto } from './dto/topup.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('topup')
export class TopupController {
  constructor(private readonly topupService: TopupService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Request() req: any, @Body() createTopupDto: CreateTopupDto, @UploadedFile() file: Express.Multer.File) {
    return this.topupService.create(req.user.userId, createTopupDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  getBalance(@Request() req: any) {
    return this.topupService.getUserBalance(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/transactions')
  getAllTransactions() {

    return this.topupService.findAll();
  }
}
