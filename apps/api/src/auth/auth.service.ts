import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private eventEmitter: EventEmitter2,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any, ip: string = 'unknown') {
        const payload = { email: user.email, sub: user.id, role: user.role };


        this.eventEmitter.emit('user.login', { email: user.email, ip });

        return {
            access_token: this.jwtService.sign(payload),
            user: payload,
        };
    }

    async register(email: string, pass: string) {
        return this.usersService.create(email, pass);
    }
}
