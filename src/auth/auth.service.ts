import * as argon2 from 'argon2';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login-auth.dto';
import { DatabaseService } from '../database/database.service';
import { ResponseHelper } from '../common/response/response.helper';
import { FailedAttempt } from './interfaces/failed-attempt-interfaces';
import { CookieService } from './cookie.service';

@Injectable()
export class AuthService {
  private failedAttempts = new Map<string, FailedAttempt>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_DURATION_MS = 60_000;

  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
  ) {}

  async login(
    loginAuthDto: LoginAuthDto,
    res: Response,
  ): Promise<ResponseHelper<void>> {
    const { username, password } = loginAuthDto;

    const user = await this.database.user.findUnique({ where: { username } });

    if (!user) throw new NotFoundException('Credenciales inválidas');

    const now = Date.now();
    const attempt = this.failedAttempts.get(username);

    if (
      attempt &&
      attempt.attempts >= this.MAX_ATTEMPTS &&
      now - attempt.lastAttempt.getTime() < this.BLOCK_DURATION_MS
    ) {
      throw new UnauthorizedException(
        'Has excedido el número máximo de intentos. Inténtalo más tarde.',
      );
    }

    const passwordValid = await argon2.verify(user.password!, password);

    if (!passwordValid) {
      this.failedAttempts.set(username, {
        attempts: (attempt?.attempts ?? 0) + 1,
        lastAttempt: new Date(now),
      });
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.failedAttempts.delete(username);

    const payload = { sub: user.id, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TOKEN'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TOKEN'),
    });

    // Usa el CookieService para setear las cookies
    this.cookieService.setAccessTokenCookie(res, accessToken);
    this.cookieService.setRefreshTokenCookie(res, refreshToken);

    return new ResponseHelper<void>('Inicio de sesión exitoso');
  }

  async refreshToken(refreshToken: string, res: Response) {
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_TOKEN');

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret,
      });

      const user = await this.database.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      const newPayload = { sub: user.id, role: user.role };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '15m',
      });

      this.cookieService.setAccessTokenCookie(res, newAccessToken);

      return new ResponseHelper<void>('Token renovado con éxito');
    } catch (error) {
      throw new UnauthorizedException('Token de actualización inválido');
    }
  }

  async logout(res: Response): Promise<ResponseHelper<void>> {
    this.cookieService.clearCookies(res);
    return new ResponseHelper<void>('Cierre de sesión exitoso');
  }
}
