import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';


@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get('stats')
    async getStats() {
        return this.dashboardService.getStats();
    }

    @Get('chart')
    async getChart() {
        return this.dashboardService.getChartData();
    }
}
