import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  AssignRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
} from './dto/permission.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectUserPermission } from '../common/interfaces/common.interface';
import { JwtGuard } from '../jwt.guard';
import { PermissionGuard } from '../permission.guard';
import { Permissions } from '../permission.decorator';

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @MessagePattern('checkProjectUserPermissions')
  checkProjectUserPermissions(@Payload() data: ProjectUserPermission) {
    return this.permissionService.checkProjectUserPermissions(data);
  }

  @Get()
  async getAllPermission() {
    return await this.permissionService.getPermissions();
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Post('role')
  @Permissions(['administer'])
  @ApiBody({ type: CreateRoleDto })
  @UsePipes(new ValidationPipe())
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    await this.permissionService.createRole(
      createRoleDto.projectId,
      createRoleDto.name,
      createRoleDto.permissions,
    );
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Get('project/:projectId/roles')
  @Permissions(['administer'])
  async getProjectAllRole(@Param('projectId') projectId: string) {
    return await this.permissionService.getProjectRoles(projectId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Get('project/:projectId/user/:username/roles')
  @Permissions(['administer'])
  async getProjectUserAllRole(
    @Param('projectId') projectId: string,
    @Param('username') username: string,
  ) {
    return await this.permissionService.getProjectUserRoles(
      projectId,
      username,
    );
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Get('project/:projectId/roles/permissions')
  @Permissions(['administer'])
  async getProjectAllRolePermissions(@Param('projectId') projectId: string) {
    return await this.permissionService.getProjectRolesPermissions(projectId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Delete('project/:projectId/role/:name')
  @Permissions(['administer'])
  async deleteRole(
    @Param('projectId') projectId: string,
    @Param('name') name: string,
  ) {
    await this.permissionService.deleteRole(projectId, name);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Put('project/:projectId/role/:name')
  @Permissions(['administer'])
  @ApiBody({ type: UpdateRoleDto })
  @UsePipes(new ValidationPipe())
  async updateRole(
    @Param('projectId') projectId: string,
    @Param('name') name: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.permissionService.updateRole(
      projectId,
      name,
      updateRoleDto.permissions,
    );
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @Post('project/:projectId/user/:username/roles')
  @Permissions(['administer'])
  @ApiBody({ type: AssignRoleDto })
  @UsePipes(new ValidationPipe())
  async assignUserRole(
    @Param('projectId') projectId: string,
    @Param('username') username: string,
    @Body() roleNames: AssignRoleDto,
  ) {
    await this.permissionService.assignUserRole(
      projectId,
      username,
      roleNames.roleNames,
    );
  }
}
