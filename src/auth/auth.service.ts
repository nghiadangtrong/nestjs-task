import { Injectable } from '@nestjs/common';
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

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.authRepository.signUp(authCredentialsDto);
    }
}
