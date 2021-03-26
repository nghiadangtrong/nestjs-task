import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { JwtStrategy } from "./jwt.strategy";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

const mockUserRepository = () => ({
    findOne: jest.fn()
})

describe('jwt.strategy', () => {
    let jwtStrategy,
        userRepository;
    
    beforeEach(async () => {
        let module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: UserRepository,
                    useFactory: mockUserRepository
                }
            ]
        }).compile();

        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
        userRepository = await module.get<UserRepository>(UserRepository);
    })

    describe('validate', () => {
        let user;

        beforeEach(() => {
            user = new User();
            user.username = 'admin';
        })

        it('success', async () => {
            userRepository.findOne.mockResolvedValue(user);
            let result = await jwtStrategy.validate({ username: 'admin' });
            expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'admin'});
            expect(result.username).toEqual('admin');
        })

        it('not success', async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(jwtStrategy.validate({ username: 'adminx' })).rejects.toThrow(UnauthorizedException);
        })
    })
})