import { BadRequestException, Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { HandleNeo4jResult } from '../common/decorators/extract-neo4j-record.decorator';
import * as _ from 'lodash';
import {
  Neo4jExtractMany,
  Neo4jExtractSingle,
} from '../common/interfaces/common.interface';

@Injectable()
export class PermissionService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createPermission(name: string) {
    try {
      await this.neo4jService.write(
        `MERGE (u:Permission {name: $name}) RETURN (u)`,
        { name: name },
      );
    } catch (error) {
      throw new BadRequestException('Failed to create user', { cause: error });
    }
  }

  @HandleNeo4jResult()
  async queryPermissions(): Neo4jExtractMany {
    return await this.neo4jService.read(`MATCH (u:Permission) RETURN (u)`);
  }

  async getAllPermissions() {
    const data = await this.queryPermissions();
    return _.map(data, (v) => v.name);
  }

  @HandleNeo4jResult(false)
  async queryRole(name: string): Neo4jExtractSingle {
    return await this.neo4jService.read(
      `MATCH (u:Role {name: $name}) RETURN (u)`,
      { name },
    );
  }

  @HandleNeo4jResult()
  async queryRoles(): Neo4jExtractMany {
    return await this.neo4jService.read(`MATCH (u:Role) RETURN (u)`);
  }

  async getAllRoles() {
    const data = await this.queryRoles();
    return _.map(data, (v) => v.name);
  }

  @HandleNeo4jResult()
  async queryUserRoles(username: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
    MATCH (:User {username: $username})-[:HAS_ROLE]->(u:Role) RETURN (u)
    `,
      { username },
    );
  }

  async getUserRoles(username: string) {
    const data = await this.queryUserRoles(username);
    return _.map(data, (v) => v.name);
  }

  @HandleNeo4jResult()
  async queryRolePermissions(name: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
    MATCH (:Role {name: $name})-[:HAS_PERMISSION]->(u:Permission) RETURN (u)
    `,
      { name },
    );
  }

  async getRolePermissions(name: string) {
    const data = await this.queryRolePermissions(name);
    return _.map(data, (v) => v.name);
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

  async writeRole(name: string, permissions: Array<string>) {
    await this.neo4jService.write(
      `
            CREATE (r:Role {name: $name}) 
            WITH r
            MATCH (p:Permission) 
            WHERE p.name IN $permissions
            CREATE (r)-[:HAS_PERMISSION]->(p)
        `,
      { name, permissions },
    );
  }

  async createRole(name: string, permissions: Array<string>) {
    const role = await this.queryRole(name);

    if (role) {
      throw new BadRequestException('Role already exists');
    }

    const existCount = await this.checkPermissionExist(permissions);
    if (existCount !== permissions.length) {
      throw new BadRequestException('Permission not exists');
    }

    await this.writeRole(name, permissions);
  }

  async updateRole(name: string, permissions: Array<string>) {
    await this.neo4jService.write(
      `
        MATCH (r:Role {name: $name})-[rel:HAS_PERMISSION]->(p:Permission)
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
      { name, permissions },
    );
  }

  async deleteRole(name: string) {
    await this.neo4jService.write(
      `
            MATCH (r:Role {name: $name}) 
            DETACH DELETE r
        `,
      { name },
    );
  }
}
