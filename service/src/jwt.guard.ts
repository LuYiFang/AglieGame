import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as cookie from 'cookie';
import * as _ from 'lodash';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('APP_SERVICE') private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException('No token found in cookie');
    }

    const payload = await firstValueFrom(
      this.client.send('validateToken', token),
    );

    const user = await firstValueFrom(
      this.client.send('findUser', {
        username: payload.username,
        properties: ['username', 'id'],
      }),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    if (user.id !== payload.id) {
      throw new UnauthorizedException('Invalid token');
    }
    request.user = payload.username;
    return true;
  }

  private extractTokenFromCookie(request: Request): string {
    return request?.cookies?.token;
  }
}
