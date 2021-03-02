import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
    async signUp (authCredentialsDto: AuthCredentialsDto) : Promise<void> {
        let { username, password } = authCredentialsDto;
        let user = new User();

        user.username = username;
        user.password = password;

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

}