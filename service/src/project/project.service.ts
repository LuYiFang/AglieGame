import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { ConfigService } from '@nestjs/config';
import { HandleNeo4jResult } from '../common/decorators/extract-neo4j-record.decorator';
import {
  Neo4jExtractMany,
  Neo4jExtractSingle,
  Porperties,
} from '../common/interfaces/common.interface';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';
import { noe4jDateReturn } from '../common/constants/common.constant';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  UpdatePropertyDto,
  UpdatePropertyNameDto,
  UpdatePropertyValueDto,
} from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly configService: ConfigService,
    @Inject('APP_SERVICE') private readonly client: ClientProxy,
  ) {}

  async writeProject(properties: Porperties) {
    const createProject = `
      CALL apoc.create.node(["Project"], $properties)
      YIELD node AS p
      SET p.uuid = apoc.create.uuid(),
          p.createdAt = datetime(),
          p.updatedAt = datetime(),
          p.createdBy = $username
    `;

    const createDafaulRole = `
      WITH p
      CALL apoc.create.node(["Role"], {name: "admin"})
      YIELD node AS r
      CREATE (p)-[:HAS_ROLE]->(r)
    `;

    const assignUserDefaulRole = `
      WITH p, r
      MATCH (u:User {username: $username})
      CREATE (u)-[:IS_ROLE]->(r)
    `;

    const assignRolePermissions = `
      WITH p, r
      UNWIND $permissions AS permission
      MATCH (perm:Permission {name: permission})
      WITH p, r, perm
      CREATE (r)-[:HAS_PERMISSION]->(perm)
    `;

    const idObj = await this.neo4jService.write(
      createProject +
        createDafaulRole +
        assignUserDefaulRole +
        assignRolePermissions +
        `RETURN p.uuid as uuid`,
      {
        username: properties.createdBy,
        properties,
        permissions: this.configService.get('DEFAULT_PERMISSIONS').split(','),
      },
    );

    return idObj.records[0].get('uuid');
  }

  async createProject(username: string, name: string, properties: Porperties) {
    if (!(await firstValueFrom(this.client.send('checkUserExist', username)))) {
      throw new BadRequestException('User not exist');
    }

    const targetProperties = { createdBy: username, name: name, ...properties };
    return await this.writeProject(targetProperties);
  }

  @HandleNeo4jResult()
  async queryUserProjects(username: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
        MATCH (:User {username: $username})-[:IS_ROLE]->(:Role)<-[:HAS_ROLE]-(d:Project) 
        RETURN d { .*,
                  ${noe4jDateReturn()}
                } AS u`,
      { username },
    );
  }

  async getUserProjects(username: string) {
    return await this.queryUserProjects(username);
  }

  @HandleNeo4jResult(false)
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

  async checkProjectExist(@Payload() projectId: string): Promise<boolean> {
    const data = await this.getProject(projectId, ['uuid']);
    if (!data || _.keys(data).length <= 0) {
      return false;
    }
    return true;
  }

  async deleteProject(projectId: string) {
    await this.neo4jService.write(
      `
        MATCH (p:Project {uuid: $projectId})
        OPTIONAL MATCH (p)-[:HAS_USERSTORY]->(u:UserStory)-[:HAS_FEATURE]->(f:Feature)
        OPTIONAL MATCH (p)-[:HAS_ROLE]->(r:Role)
        OPTIONAL MATCH (p)-[:HAS_SETTING]->(s:Setting)
        DETACH DELETE p, u, f, r, s
      `,
      { projectId },
    );
  }

  async preCheckProject(projectId: string, username: string) {
    const isExist = await this.checkProjectExist(projectId);
    if (!isExist) {
      throw new BadRequestException('Project does not exist');
    }
    const isValid = await firstValueFrom(
      this.client.send('checkProjectUserPermissions', {
        projectId,
        username,
        permissions: ['write'],
      }),
    );
    if (!isValid) {
      throw new UnauthorizedException('User does not have permission');
    }
  }

  async updateProjectProperty(
    projectId: string,
    { username, propertyName, propertyValue }: UpdatePropertyValueDto,
  ) {
    await this.preCheckProject(projectId, username);
    await this.neo4jService.write(
      `
      MATCH (p:Project {uuid: $projectId})
      CALL apoc.create.setProperty(p, $propertyName, $propertyValue)
      YIELD node
      RETURN node
      `,
      { projectId, propertyName, propertyValue },
    );
  }

  async updateProjectPropertyName(
    projectId: string,
    { username, propertyName, newPropertyName }: UpdatePropertyNameDto,
  ) {
    await this.preCheckProject(projectId, username);
    await this.neo4jService.write(
      `
      MATCH (p:Project {uuid: $projectId})
      CALL apoc.refactor.rename.nodeProperty($propertyName, $newPropertyName, [p])
      YIELD batches
      RETURN batches
      `,
      { projectId, propertyName, newPropertyName },
    );
  }

  async deleteProjectProperty(
    projectId: string,
    { username, propertyName }: UpdatePropertyDto,
  ) {
    await this.preCheckProject(projectId, username);
    await this.neo4jService.write(
      `
      MATCH (p:Project {uuid: $projectId})
      CALL apoc.create.removeProperties([p], [$propertyName])
      YIELD node
      RETURN node
      `,
      { projectId, propertyName },
    );
  }
}
