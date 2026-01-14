import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, Request, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: Record<string, any>, @Ip() ip: string) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user, ip);
    }

    @Post('register')
    async register(@Body() body: Record<string, any>) {
        return this.authService.register(body.email, body.password);
    }
}
