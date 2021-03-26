import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(UserRepository)
        private UserRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.UserRepository.signUp(authCredentialsDto);
    }

    async signIn (authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        let username = await this.UserRepository.validateUserPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials')
        }

        let payload: JwtPayload = { username };
        let accessToken = await this.jwtService.sign(payload);

        return { accessToken };
    }
}
