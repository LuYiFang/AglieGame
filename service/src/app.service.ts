import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';
import { PermissionService } from './permission/permission.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly permissionService: PermissionService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createUserUniqueConstraint();
    await this.createPermissionUniqueConstraint();
    await this.createInitPermissions();
    await this.initRole();
    this.initProject();
    this.initUserStory();
  }

  async initProject() {
    this.neo4jService.write(
      'CREATE CONSTRAINT projectUuidUnique IF NOT EXISTS FOR (r:Project) REQUIRE r.uuid IS UNIQUE',
    );
  }

  async initUserStory() {
    this.neo4jService.write(
      'CREATE CONSTRAINT userStoryUuidUnique IF NOT EXISTS FOR (r:UserStory) REQUIRE r.uuid IS UNIQUE',
    );
  }

  async createUserUniqueConstraint() {
    try {
      await this.neo4jService.write(
        `
        CREATE CONSTRAINT userUsernameUnique IF NOT EXISTS FOR (u:User) REQUIRE u.username IS UNIQUE
        `,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error when init database', {
        cause: error,
      });
    }
  }

  async initRole() {
    try {
      this.neo4jService.write(
        'CREATE INDEX roleNameIndex IF NOT EXISTS FOR (r:Role) ON (r.name)',
      );
    } catch (error) {
      throw new InternalServerErrorException('Error when init database', {
        cause: error,
      });
    }
  }

  async createPermissionUniqueConstraint() {
    try {
      await this.neo4jService.write(
        `
        CREATE CONSTRAINT permissionNameUnique IF NOT EXISTS FOR (u:Permission) REQUIRE u.name IS UNIQUE
        `,
      );
    } catch (error) {
      throw new InternalServerErrorException('Error when init database', {
        cause: error,
      });
    }
  }

  async createInitPermissions() {
    const defaultPermissions = this.configService
      .get('DEFAULT_PERMISSIONS')
      .split(',');
    defaultPermissions.forEach((perm) => {
      this.permissionService.createPermission(perm);
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
