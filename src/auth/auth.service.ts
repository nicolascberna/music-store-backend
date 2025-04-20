import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt'
import { RegisterDto } from './dto/register.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, username } = registerDto
        const existingUser = await this.prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            throw new BadRequestException('Email already registered.')
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.prisma.user.create({
            data: {
                email,
                hashedPassword,
                username,
            },
        });
        const payload = { sub: user.id, email: user.email }
        const token = this.jwtService.sign(payload)
        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
            accessToken: token,
        }
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || user.password !== password) {
            throw new Error('Invalid credentials');
        }
        return user;
    }

    async getUserById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
