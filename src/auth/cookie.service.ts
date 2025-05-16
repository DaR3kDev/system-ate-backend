import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CookieService {
  private accessCookieName: string;
  private refreshCookieName: string;

  constructor(private readonly configService: ConfigService) {
    this.accessCookieName =
      this.configService.get<string>('AUTH_COOKIE_NAME') ?? 'auth_token';
    this.refreshCookieName =
      this.configService.get<string>('REFRESH_COOKIE_NAME') ?? 'refresh_token';
  }

  setAccessTokenCookie(res: Response, token: string) {
    res.cookie(this.accessCookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 minutos
      path: '/',
    });
  }

  setRefreshTokenCookie(res: Response, token: string) {
    res.cookie(this.refreshCookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
      path: '/',
    });
  }

  clearCookies(res: Response) {
    res.clearCookie(this.accessCookieName);
    res.clearCookie(this.refreshCookieName);
  }
}
