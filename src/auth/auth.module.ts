import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../accounts/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../accounts/user/entities/user.entity'; 
import { PasswordService } from '../utils/password.utils';
import { UtilsModule } from '../utils/utils.module';
import { RolesGuard } from '../guards/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    UtilsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET') || 'default_secret';
        console.log(`[AuthModule] JwtModule.register: Usando secreto para FIRMAR: ${secret}`); 
        return {
          secret: secret,
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [ConfigService], 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordService, RolesGuard, AuthResolver],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}