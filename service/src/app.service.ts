import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { PermissionService } from './permission/permission.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async createDummy() {
    this.configService.get('DUMMY');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
