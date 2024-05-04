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
  Request,
  UseGuards,
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
import { JwtGuard } from '../jwt.guard';
import { PermissionGuard } from '../permission.guard';
import { Permissions } from '../permission.decorator';

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
    return await this.projectService.createProject(
      createProjectDto.username,
      createProjectDto.name,
      createProjectDto.properties,
    );
  }

  @UseGuards(JwtGuard)
  @Get('user')
  async getUserProject(@Request() req) {
    return await this.projectService.getUserProjects(req.user);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Get(':projectId')
  @Permissions(['read'])
  async getProject(@Param('projectId') projectId: string) {
    return await this.projectService.getProject(projectId, 'all');
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Delete(':projectId')
  @Permissions(['delete'])
  async deleteProject(@Param('projectId') projectId: string) {
    return await this.projectService.deleteProject(projectId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Patch(':projectId/propertyValue')
  @Permissions(['write'])
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

  @UseGuards(JwtGuard, PermissionGuard)
  @Patch(':projectId/name/propertyName')
  @Permissions(['write'])
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

  @UseGuards(JwtGuard, PermissionGuard)
  @Delete(':projectId/property')
  @Permissions(['delete'])
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
