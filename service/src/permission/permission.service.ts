import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { HandleNeo4jResult } from '../common/decorators/extract-neo4j-record.decorator';
import * as _ from 'lodash';
import {
  Neo4jExtractMany,
  Neo4jExtractSingle,
  ProjectUserPermission,
} from '../common/interfaces/common.interface';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly configService: ConfigService,
    @Inject('APP_SERVICE') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.createPermissionUniqueConstraint();
    await this.createInitPermissions();
    await this.initRole();
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

    await Promise.all(
      _.map(defaultPermissions, (perm) => this.createPermission(perm)),
    );
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

  async createPermission(name: string) {
    try {
      await this.neo4jService.write(
        `MERGE (u:Permission {name: $name}) RETURN (u)`,
        { name: name },
      );
    } catch (error) {
      throw new BadRequestException('Failed to create permission', {
        cause: error,
      });
    }
  }

  @HandleNeo4jResult()
  async queryPermissions(): Neo4jExtractMany {
    return await this.neo4jService.read(`
      MATCH (u:Permission) 
      RETURN (u)
      ORDER BY u.name
    `);
  }

  async getPermissions() {
    const data = await this.queryPermissions();
    return _.map(data, (v) => v.name);
  }

  @HandleNeo4jResult(false)
  async queryRole(projectId: string, name: string): Neo4jExtractSingle {
    return await this.neo4jService.read(
      `MATCH (:Project {uuid: $projectId})-[:HAS_ROLE]->(u:Role {name: $name}) RETURN (u)`,
      { projectId, name },
    );
  }

  @HandleNeo4jResult()
  async queryRoles(projectId: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
        MATCH (:Project {uuid: $projectId})-[:HAS_ROLE]->(u:Role)
        RETURN (u)
        ORDER BY u.name
      `,
      { projectId },
    );
  }

  async getProjectRoles(projectId: string) {
    const data = await this.queryRoles(projectId);
    return _.map(data, (v) => v.name);
  }

  @HandleNeo4jResult()
  async queryProjectUserRoles(
    projectId: string,
    username: string,
  ): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
    MATCH (:User {username: $username})-[:IS_ROLE]->(u:Role)<-[:HAS_ROLE]-(:Project {uuid: $projectId}) 
    RETURN (u)
    ORDER BY u.name
    `,
      { username, projectId },
    );
  }

  async getProjectUserRoles(projectId: string, username: string) {
    const data = await this.queryProjectUserRoles(projectId, username);
    return _.map(data, (v) => v.name);
  }

  async queryProjectRolesPermissions(projectId: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
      MATCH (:Project {uuid: $projectId})-[:HAS_ROLE]->(r:Role)
      MATCH (r)-[:HAS_PERMISSION]->(p:Permission)
      RETURN r.name AS Role, collect(p.name) AS Permissions
      ORDER BY r.name, Permissions
    `,
      { projectId },
    );
  }

  async getProjectRolesPermissions(projectId: string) {
    const data = await this.queryProjectRolesPermissions(projectId);
    let targetData = {};
    _.each(data.records, (v) => {
      targetData[v.get('Role')] = v.get('Permissions');
    });
    return targetData;
  }

  @HandleNeo4jResult()
  async queryProjectUserPermissions(
    projectId: string,
    username: string,
    permissions: Array<string>,
  ): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
      MATCH (:Project {uuid: $projectId})-[:HAS_ROLE]->(r:Role)
      MATCH (:User {username: $username})-[:IS_ROLE]->(r)
      MATCH (r)-[:HAS_PERMISSION]->(p:Permission)
      WHERE p.name in $permissions
      RETURN p AS u
    `,
      { projectId, username, permissions },
    );
  }

  async checkProjectUserPermissions({
    projectId,
    username,
    permissions,
  }: ProjectUserPermission) {
    const data = await this.queryProjectUserPermissions(
      projectId,
      username,
      permissions,
    );
    return data.length === permissions.length;
  }

  async checkPermissionExist(permissions: Array<string>) {
    const existPermissions = await this.neo4jService.read(
      `
        UNWIND $permissions AS permission
        MATCH (p:Permission {name: permission})
        WITH collect(p) AS u, count(p) AS pCount
        WHERE size($permissions) = pCount
        RETURN u
    `,
      { permissions },
    );
    return existPermissions.records[0]?.get('u').length;
  }

  async writeRole(projectId: string, name: string, permissions: Array<string>) {
    await this.neo4jService.write(
      `
            CREATE (r:Role {name: $name}) 
            WITH r
            MATCH (pr:Project {uuid: $projectId})
            CREATE (pr)-[:HAS_ROLE]->(r)
            WITH r
            MATCH (p:Permission) 
            WHERE p.name IN $permissions
            CREATE (r)-[:HAS_PERMISSION]->(p)
        `,
      { projectId, name, permissions },
    );
  }

  async createRole(
    projectId: string,
    name: string,
    permissions: Array<string>,
  ) {
    const projectExists = await firstValueFrom(
      this.client.send('checkProjectExist', projectId),
    );
    if (!projectExists) {
      throw new BadRequestException('Project not exists');
    }

    const role = await this.queryRole(projectId, name);
    if (role) {
      throw new BadRequestException('Role already exists');
    }

    const existCount = await this.checkPermissionExist(permissions);
    if (existCount !== permissions.length) {
      throw new BadRequestException('Permission not exists');
    }

    await this.writeRole(projectId, name, permissions);
  }

  async updateRole(
    projectId: string,
    name: string,
    permissions: Array<string>,
  ) {
    const projectExists = await firstValueFrom(
      this.client.send('checkProjectExist', projectId),
    );
    if (!projectExists) {
      throw new BadRequestException('Project not exists');
    }

    const role = await this.queryRole(projectId, name);
    if (!role) {
      throw new BadRequestException(`Role ${name} not exists`);
    }

    await this.neo4jService.write(
      `
        MATCH (:Project {uuid: $projectId})-[:HAS_ROLE]->(r:Role {name: $name})
        MATCH (r)-[rel:HAS_PERMISSION]->(p:Permission)
        WITH r, collect(p.name) AS oldPermissions, $permissions AS newPermissions
        CALL {
          WITH r, oldPermissions, newPermissions
          UNWIND oldPermissions AS oldPermission
          WITH r, oldPermission, newPermissions
          WHERE NOT oldPermission IN newPermissions
          MATCH (r)-[rel:HAS_PERMISSION]->(p:Permission {name: oldPermission})
          DELETE rel
        }
        CALL {
          WITH r, oldPermissions, newPermissions
          UNWIND newPermissions AS newPermission
          WITH r, newPermission, oldPermissions
          WHERE NOT newPermission IN oldPermissions
          MATCH (p:Permission {name: newPermission})
          MERGE (r)-[:HAS_PERMISSION]->(p)
        }
        RETURN r
          `,
      { projectId, name, permissions },
    );
  }

  @HandleNeo4jResult(false)
  async getRoleBeenUsed(projectId: string, name: string): Neo4jExtractSingle {
    return await this.neo4jService.read(
      `
      MATCH (:Project {uuid: $projectId})-[:HAS_ROLE]->(r:Role {name: $name})
      MATCH (us:User)-[:IS_ROLE]->(r)
      RETURN COUNT(us) AS u
  `,
      { projectId, name },
    );
  }

  async deleteRole(projectId: string, name: string) {
    const projectExists = await firstValueFrom(
      this.client.send('checkProjectExist', projectId),
    );
    if (!projectExists) {
      throw new BadRequestException('Project not exists');
    }

    const role = await this.queryRole(projectId, name);
    if (!role) {
      throw new BadRequestException(`Role ${name} not exists`);
    }

    const count = await this.getRoleBeenUsed(projectId, name);
    if (count.low > 0) {
      throw new ConflictException(`Role is still in use`);
    }

    await this.neo4jService.write(
      `
            MATCH (:Project {uuid: $projectId})-[:HAS_ROLE]->(r:Role {name: $name})
            MATCH (r)-[rel:HAS_PERMISSION]->(p:Permission)
            DETACH DELETE r
        `,
      { projectId, name },
    );
  }

  async assignUserRole(
    projectId: string,
    username: string,
    roleNames: Array<string>,
  ) {
    const projectExists = await firstValueFrom(
      this.client.send('checkProjectExist', projectId),
    );
    if (!projectExists) {
      throw new BadRequestException('Project not exists');
    }

    if (!(await firstValueFrom(this.client.send('checkUserExist', username)))) {
      throw new BadRequestException('User not exist');
    }

    await Promise.all(
      _.map(roleNames, async (name) => {
        const role = await this.queryRole(projectId, name);
        if (!role) {
          throw new BadRequestException(`Role ${name} not exists`);
        }
      }),
    );

    await this.neo4jService.write(
      `
            MATCH (u:User {username: $username})
            WITH u, $roleNames AS roleNames
            UNWIND roleNames AS roleName
            MATCH (p:Project {uuid: $projectId})-[:HAS_ROLE]->(r:Role {name: roleName})
            CREATE (u)-[:IS_ROLE]->(r)
        `,
      { projectId, username, roleNames },
    );
  }
}
