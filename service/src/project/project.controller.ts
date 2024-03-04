import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
    return await this.projectService.getUserProject(username);
  }

  @Delete(':projectId')
  async DeleteProject(@Param('projectId') projectId: string) {
    return await this.projectService.deleteProject(projectId);
  }
}
