import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Test } from "@nestjs/testing"
import { User } from "./user.entity";
import { UserRepository } from "./user.repository"
import * as bcrypt from 'bcrypt';

const mockCredentialsDto = {
    username: 'admin',
    password: 'correct'
}

describe('UserRepository', () => {
    let userRepository;

    beforeEach(async () => {
        let module = await Test.createTestingModule({
            providers: [
                UserRepository
            ]
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository); 
    })

    describe('signUp', () => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('successfully signs up the user', async () => {
            save.mockResolvedValue(undefined);
            await expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
        });

        it('throws a conflict exception as username already exists', async () => {
            save.mockRejectedValue({ code: '23505' });
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('throw a other error', async () => {
            save.mockRejectedValue({ code: '404'});
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        })
    })

    describe('validdateUserPassword', () => {
        let user;

        beforeEach(() => {
            userRepository.findOne = jest.fn(); 
            user = new User();
            user.username = 'admin';
            user.validatePassword = jest.fn();
        })

        it('successfully validated password', async () => {
            user.validatePassword.mockResolvedValue(true);
            userRepository.findOne.mockResolvedValue(user);
            await expect(userRepository.validateUserPassword(mockCredentialsDto)).resolves.toEqual('admin');
            expect(user.validatePassword).toHaveBeenCalled();
        })

        it('Not found user', async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(userRepository.validateUserPassword(mockCredentialsDto)).resolves.toBeNull();
            expect(user.validatePassword).not.toHaveBeenCalled();
        })

        it('password not true',  async () => {
            user.validatePassword.mockResolvedValue(false)
            userRepository.findOne = jest.fn().mockResolvedValue(user);
            await expect(userRepository.validateUserPassword(mockCredentialsDto)).resolves.toBeNull();
            expect(user.validatePassword).toHaveBeenCalled();
        })
    })

    describe('hashPassword', () => {
        it('successfully', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testhash');

            expect(bcrypt.hash).not.toHaveBeenCalled();
            let result = await userRepository.hashPassword('secret', 'xxxx'); 
            expect(bcrypt.hash).toHaveBeenCalledWith('secret', 'xxxx');
            expect(result).toEqual('testhash');
        })
    })
})