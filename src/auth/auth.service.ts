import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository
    ) {}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authRepository.signUp(authCredentialsDto);
    }

    async signIn (authCredentialsDto: AuthCredentialsDto): Promise<string> {
        let username = await this.authRepository.validateUserPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return username;
    }
}
