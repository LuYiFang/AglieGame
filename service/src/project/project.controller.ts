import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  CreateProjectDto,
  UpdateProjectDto,
  UpdatePropertyDto,
  UpdatePropertyNameDto,
  UpdatePropertyValueDto,
} from './dto/project.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern('checkProjectExist')
  checkProjectExist(@Payload() projectId: string) {
    return this.projectService.checkProjectExist(projectId);
  }

  @Post()
  @ApiBody({ type: CreateProjectDto })
  @UsePipes(new ValidationPipe())
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    await this.projectService.createProject(
      createProjectDto.username,
      createProjectDto.name,
      createProjectDto.properties,
    );
  }

  @Get(':username')
  async getUserProject(@Param('username') username: string) {
    return await this.projectService.getUserProjects(username);
  }

  @Delete(':projectId')
  async deleteProject(@Param('projectId') projectId: string) {
    return await this.projectService.deleteProject(projectId);
  }

  @Put(':projectId/propertyValue')
  @ApiBody({ type: UpdatePropertyValueDto })
  @UsePipes(new ValidationPipe())
  async updateProjectProperty(
    @Param('projectId') projectId: string,
    @Body() updatePropertyValueDto: UpdatePropertyValueDto,
  ) {
    return await this.projectService.updateProjectProperty(
      projectId,
      updatePropertyValueDto,
    );
  }

  @Patch(':projectId/propertyName')
  @ApiBody({ type: UpdatePropertyNameDto })
  @UsePipes(new ValidationPipe())
  async updatePropertyName(
    @Param('projectId') projectId: string,
    @Body() updatePropertyNameDto: UpdatePropertyNameDto,
  ) {
    return await this.projectService.updateProjectPropertyName(
      projectId,
      updatePropertyNameDto,
    );
  }

  @Delete(':projectId/property')
  @ApiBody({ type: UpdatePropertyDto })
  @UsePipes(new ValidationPipe())
  async deleteProperty(
    @Param('projectId') projectId: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return await this.projectService.deleteProjectProperty(
      projectId,
      updatePropertyDto,
    );
  }
}
