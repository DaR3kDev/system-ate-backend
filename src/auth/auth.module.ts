import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET_TOKEN'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION_TOKEN') },
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_REFRESH_TOKEN'),
        signOptions: {
          expiresIn: config.get<string>('JWT_REFRESH_EXPIRATION_TOKEN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtRefreshStrategy, JwtStrategy],
})
export class AuthModule {}
