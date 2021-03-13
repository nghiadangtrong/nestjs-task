<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
	npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Tổng hợp - Menu - 9394 - 62end

1.cli

### install

yarn global add @nestjs/cli

### cai global

- lấy đường yarn global bin (path_bin): yarn global bin
- Thêm cuối dòng file: ~/.bashrc  | ~.zshrc

`export PATH=$PATH:path_bin`

vd: `export PATH=$PATH:/home/noan/.yarn/bin`

### check

```bash
nest -v
nest new name-project
```

### Follwer

`Module => Controler => Service => Repository => Entity`

### create module

`nest g module task  'create module name task'`

### create controller

`nest g controller task --no-spect 'Tạo task.controller và không tạo file unit test'`

### create service

`nest g service task --no-spect 'Tạo task.service và không tạo file unit test'`

2.Data Transfer Objects (DTO)

- Là một design pattern giúp code dễ  maintain
- Cho phép biết tham số có thể chuyền vào ~ Validate dữ liệu từ client

3.Pipes - validator

- Dùng để kiểm (validation) dữ liệu từ gửi client

### validator

`yarn add class-validator class-transformer`

4.TypeORM ([https://typeorm.io/#/](https://typeorm.io/#/))

`yarn add @nestjs/typeorm typeorm pg`

- Config TypORM to app.module.ts
- Import TypeOrm to App.module.ts

- Make Entity: task.entity.ts
- Make Repository: task.repository.ts
- InjectRespository TaskRespotitory in TaskModal

5.Auth

- *create file*

```bash
nest g module auth
nest g controller auth --no-spec
nest g service auth --no-spec

create /auth/user.entity.ts
create /auth/auth.repository.ts

create /auth/dto/auth-credentials.dto.ts
```

- *Validate password strong*

```typscript
  @MinLength(8)
  @Matches (
    /((?=.\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak' }
  )
  password: string

```

- *Unique*

```typescript
@Enity()
@Unique(['column_name'])
export class User extends BaseEntity {}
```

## hash password + salt

- *Install bcrypt*

`yarn add bcrypt`

- *Lưu salt vs password*

```typescript
import * as bcrypt from 'bcrypt';

user.salt = await bcrypt.genSalt();
user.password = await bcrypt.hash(password, user.salt);

```

- *Kiểm tra password hợp lệ*

```typescript

  @Entity()
  class User {
    ...
    validatePassword (password: string): Promise<boolean> {
      let hash = await bcrypt.hash(password, this.salt);
      return hash === this.password;
    }
  }
  
```

## Jwt + passport

- **Jwt**
Header      metadata token
Payload     Data
Signature   Mã hóa từ Header và Paylaod

- Install `yarn add @nestjs/jwt @nestjs/passport passport passport-jwt`

- Add Module */auth/auth.module.ts*

```typescript
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nest/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: 36000
      }
    }),
    providers: [
      AuthService,
      JwtStrategy
    ],
    exports: [
      JwtStrategy,
      PassportModule
    ]
  ]
})
export class AuthModule {}
```

- Create token */auth/auth.service.ts*

```typescript
import { JwtService } from '@nestjs/jwt';

...
contructor(private jwtService: JwtService) {}

...
let payload = { username };
let accessToken = this.jwtService.sign(payload);

```

### authen

[**Document**](https://docs.nestjs.com/security/authentication#jwt-functionality)

- Create file */auth/jwt.strategy.ts*

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromHeader: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret'
    })
  }

  async validate (payload: JwtPayload) {
    return payload.username;
  }
}
```

- Bảo vệ theo route

_Controler file_

```typescript
import { UseGuards } from '@nestjs/common';
import { UseGuards, AuthGuard} from '@nestjs/passport';

@get('edit-profile')
@UseGuards(AuthGuard())
editProfile(@Req() req) {
  console.log('username', req.username);
}
```

## Configuration

- Dùng file .env, .yml

## Throw exception

```typescript

throw new ConflictException('Username already exists'); 

throw new InternalServerErrorException(); // Ngoại lệ lỗi máy chủ nội bộ

throw new UnauthorizedException('Invalid credentials'); // SignIn thất bại 

```
