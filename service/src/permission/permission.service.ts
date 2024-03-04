import { BadRequestException, Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { HandleNeo4jResult } from '../common/decorators/extract-neo4j-record.decorator';
import * as _ from 'lodash';
import {
  Neo4jExtractMany,
  Neo4jExtractSingle,
} from '../common/interfaces/common.interface';
import { ProjectService } from '../project/project.service';

@Injectable()
export class PermissionService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly projectService: ProjectService,
  ) {}

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
  async queryRole(projectId: string, name: string): Neo4jExtractSingle {
    return await this.neo4jService.read(
      `MATCH (u:Role {uniqueId: $projectId + $name}) RETURN (u)`,
      { projectId, name },
    );
  }

  @HandleNeo4jResult()
  async queryRoles(projectId: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `MATCH (u:Role {projectId: $projectId}) RETURN (u)`,
      { projectId },
    );
  }

  async getProjectAllRoles(projectId: string) {
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
    MATCH (:User {username: $username})-[:IS_ROLE]->(u:Role {projectId: $projectId}) RETURN (u)
    `,
      { username, projectId },
    );
  }

  async getProjectUserRoles(projectId: string, username: string) {
    const data = await this.queryProjectUserRoles(projectId, username);
    return _.map(data, (v) => v.name);
  }

  async queryProjectAllRolePermissions(projectId: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
      MATCH (r:Role {projectId: $projectId})-[:HAS_PERMISSION]->(p:Permission)
      RETURN r.name AS Role, collect(p.name) AS Permissions
    `,
      { projectId },
    );
  }

  async getProjectAllRolePermissions(projectId: string) {
    const data = await this.queryProjectAllRolePermissions(projectId);
    let targetData = {};
    _.each(data.records, (v) => {
      targetData[v.get('Role')] = v.get('Permissions');
    });
    return targetData;
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
            CREATE (r:Role {name: $name, projectId: $projectId, uniqueId: $projectId + $name}) 
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
    if (!(await this.projectService.checkProjectExist(projectId))) {
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
    await this.neo4jService.write(
      `
        MATCH (r:Role {uniqueId: $projectId + $name})-[rel:HAS_PERMISSION]->(p:Permission)
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

  async deleteRole(projectId: string, name: string) {
    await this.neo4jService.write(
      `
            MATCH (r:Role {uniqueId: $projectId + $name}) 
            DETACH DELETE r
        `,
      { projectId, name },
    );
  }
}
