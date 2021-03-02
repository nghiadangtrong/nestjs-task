import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
    async signUp (authCredentialsDto: AuthCredentialsDto) : Promise<void> {
        let { username, password } = authCredentialsDto;
        let user = new User();

        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try { 
            await user.save();
        } catch (error) {
            if (error === '23505') { // duplicate username
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException(); // Ngoại lệ lỗi máy chủ nội bộ
            }
        }
    }

    async validateUserPassword (authCredentialsDto: AuthCredentialsDto): Promise<string> {
        let { username, password } = authCredentialsDto;
        let user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        }

        return null;
    }

    private hashPassword (password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

}