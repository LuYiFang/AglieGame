import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { HandleNeo4jResult } from '../../common/decorators/extract-neo4j-record.decorator';
import {
  Neo4jExtractMany,
  Neo4jExtractSingle,
  Porperties,
} from '../../common/interfaces/common.interface';
import { PermissionService } from '../../permission/permission.service';
import { ProjectService } from '../../project/project.service';
import { noe4jDateReturn } from '../../common/constants/common.constant';

@Injectable()
export class UserStoryService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly permissionService: PermissionService,
    private readonly projectService: ProjectService,
  ) {}

  @HandleNeo4jResult()
  async queryProjectStories(projectId: string): Neo4jExtractMany {
    return await this.neo4jService.read(
      `
          MATCH (:Project {uuid: $projectId})-[:HAS_USER_STORY]->(d:UserStory)
          RETURN d { .*,
                    ${noe4jDateReturn}
                  } AS u
          `,
      { projectId },
    );
  }

  async getProjectStories(projectId: string) {
    return await this.queryProjectStories(projectId);
  }

  @HandleNeo4jResult(false)
  async writeUserStory(
    projectId: string,
    username: string,
    properties: Porperties,
  ): Neo4jExtractSingle {
    return await this.neo4jService.write(
      `
        CALL apoc.create.node(["UserStory"], $properties)
        YIELD node AS us
        SET us.uuid = apoc.create.uuid(),
            us.createdAt = datetime(),
            us.updatedAt = datetime(),
            us.createdBy = $username
        WITH us
        MATCH (p:Project {uuid: $projectId})
        CREATE (p)-[:HAS_USER_STORY]->(us)
        RETURN us.uuid as u
        `,
      { projectId, username, properties },
    );
  }

  async createUserStory(
    projectId: string,
    username: string,
    properties: Porperties,
  ) {
    const isExist = await this.projectService.checkProjectExist(projectId);
    if (!isExist) {
      throw new BadRequestException('Porject does not exist');
    }

    const isValid = await this.permissionService.checkProjectUserPermissions({
      projectId,
      username,
      permissions: ['create'],
    });
    if (!isValid) {
      throw new UnauthorizedException('User does not have permission');
    }

    return await this.writeUserStory(projectId, username, properties);
  }
}
