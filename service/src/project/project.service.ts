import { BadRequestException, Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Porperties } from './interfaces/project.interface';
import { ConfigService } from '@nestjs/config';
import { HandleNeo4jResult } from '../common/decorators/extract-neo4j-record.decorator';
import {
  Neo4jExtractMany,
  Neo4jExtractSingle,
} from '../common/interfaces/common.interface';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async writeProject(username: string, properties: Porperties) {
    const idObj = await this.neo4jService.write(
      `
            MATCH (u:User {username: $username})
            CALL apoc.create.node(["Project"], $properties)
            YIELD node AS p
            SET p.uuid = apoc.create.uuid(),
                p.createdAt = datetime(),
                p.updatedAt = datetime()
            WITH u, p
            CREATE (u)-[:CREATE_PROJECT]->(p)
            WITH u, p
            CALL apoc.create.node(["Role"], {name: "admin", projectId: p.uuid, uniqueId: p.uuid + "admin"})
            YIELD node AS r
            CREATE (p)-[:HAS_ROLE]->(r)
            WITH u, p, r
            CREATE (u)-[:IS_ROLE]->(r)
            WITH u, p, r
            UNWIND $permissions AS permission
            MATCH (perm:Permission {name: permission})
            WITH p, r, perm
            CREATE (r)-[:HAS_PERMISSION]->(perm)
            RETURN p.uuid as uuid
              `,
      {
        username,
        properties,
        permissions: this.configService.get('DEFAULT_PERMISSIONS').split(','),
      },
    );

    return idObj.records[0].get('uuid');
  }

  async createProject(username: string, name: string, properties: Porperties) {
    if (!(await this.userService.checkUserExist(username))) {
      throw new BadRequestException('User not exist');
    }

    const targetProperties = { name: name, ...properties };
    return await this.writeProject(username, targetProperties);
  }

  @HandleNeo4jResult()
  async queryUserProject(username: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
        MATCH (:User {username: $username})-[:CREATE_PROJECT]->(u:Project) 
        RETURN (u)`,
      { username },
    );
  }

  async getUserProject(username: string) {
    return await this.queryUserProject(username);
  }

  @HandleNeo4jResult()
  async queryProject(projectId: string): Neo4jExtractSingle {
    return await this.neo4jService.read(
      `
        MATCH (u:Project {uuid: $projectId}) 
        RETURN (u)`,
      { projectId },
    );
  }

  async getProject(
    projectId: string,
    properties: Array<string> = ['name'],
  ): Promise<{ [key: string]: any } | null> {
    const data = await this.queryProject(projectId);
    if (!data) return null;

    return _.pick(data, properties);
  }

  async checkProjectExist(projectId: string): Promise<boolean> {
    const data = await this.getProject(projectId);
    if (!data || _.keys(data).length <= 0) {
      return false;
    }
    return true;
  }

  async deleteProject(projectId: string) {
    await this.neo4jService.write(
      `
        MATCH (p:Project {uuid: $projectId })-[:HAS_ROLE]->(r:Role) 
        DETACH DELETE p, r`,
      { projectId },
    );
  }
}
