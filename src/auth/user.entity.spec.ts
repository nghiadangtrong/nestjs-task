import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('user.entity', () => {
    let user;

    beforeEach(() => {
        user = new User();
        user.salt = 'saltxxx';
        user.password = 'secret'; 
        bcrypt.hash = jest.fn();
    })

    describe('validatePassword', () => { 

        it('correct password', async () => {
            bcrypt.hash.mockResolvedValue('secret');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            await expect(user.validatePassword('password')).resolves.toEqual(true);
            expect(bcrypt.hash).toHaveBeenCalledWith('password', 'saltxxx');
        })

        it('uncorrect password', async () => {
            bcrypt.hash.mockResolvedValue('secretxx');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            await expect(user.validatePassword('passwordxxx')).resolves.toEqual(false);
            expect(bcrypt.hash).toHaveBeenCalledWith('passwordxxx', 'saltxxx');
        })
    })
})