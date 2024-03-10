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
import { PermissionService } from './permission.service';
import { ApiBody } from '@nestjs/swagger';
import {
  AssignRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
} from './dto/permission.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProjectUserPermission } from 'src/common/interfaces/common.interface';

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

  @Post('role')
  @ApiBody({ type: CreateRoleDto })
  @UsePipes(new ValidationPipe())
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    await this.permissionService.createRole(
      createRoleDto.projectId,
      createRoleDto.name,
      createRoleDto.permissions,
    );
  }

  @Get('project/:projectId/roles')
  async getProjectAllRole(@Param('projectId') projectId: string) {
    return await this.permissionService.getProjectRoles(projectId);
  }

  @Get('project/:projectId/user/:username/roles')
  async getProjectUserAllRole(
    @Param('projectId') projectId: string,
    @Param('username') username: string,
  ) {
    console.log('projectId', projectId);
    return await this.permissionService.getProjectUserRoles(
      projectId,
      username,
    );
  }

  @Get('project/:projectId/roles/permissions')
  async getProjectAllRolePermissions(@Query('projectId') projectId: string) {
    return await this.permissionService.getProjectRolesPermissions(projectId);
  }

  @Delete('project/:projectId/role/:name')
  async deleteRole(
    @Param('projectId') projectId: string,
    @Param('name') name: string,
  ) {
    await this.permissionService.deleteRole(projectId, name);
  }

  @Put('project/:projectId/role/:name')
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

  @Post('project/:projectId/user/:username/roles')
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
