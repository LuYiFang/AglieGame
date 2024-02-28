import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const token = req.cookies['token'];
    if (!token) throw new UnauthorizedException('Invalid credentials');
    const payload = this.authService.validateToken(token);
    return payload;
  }
}
