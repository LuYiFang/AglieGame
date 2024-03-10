import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/project.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

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

  @Put(':projectId')
  async updateProject(
    @Param('projectId') projectId: string,
    @Query('username') username: string,
  ) {
    return await this.projectService.updateProject(projectId, username);
  }
}
