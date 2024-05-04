import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Permissions } from './permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('APP_SERVICE') private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let projectId = request.params?.projectId;
    if (!projectId) {
      projectId = request.body?.projectId;
    }
    const username = request.user;

    const permissions = this.reflector.get(Permissions, context.getHandler());

    const isValid = await firstValueFrom(
      this.client.send('checkProjectUserPermissions', {
        projectId,
        username,
        permissions,
      }),
    );
    return isValid;
  }
}
