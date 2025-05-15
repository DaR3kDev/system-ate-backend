import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies?.['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided in cookies');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return true;
  }
}
