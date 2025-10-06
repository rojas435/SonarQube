import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PasswordService } from 'src/utils/password.utils';
import { UserResolver } from './user.resolver';
import { BasicResolver } from './basic.resolver';
import { TestResolver } from './test.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, PasswordService, UserResolver, BasicResolver, TestResolver],
  exports: [UserService, TypeOrmModule  ],
})
export class UserModule {
  constructor() {
    console.log('UserModule inicializado');
  }
}