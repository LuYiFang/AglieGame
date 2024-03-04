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
import { CreateRoleDto, UpdateRoleDto } from './dto/permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async getAllPermission() {
    return await this.permissionService.getAllPermissions();
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
    return await this.permissionService.getProjectAllRoles(projectId);
  }

  @Get('project/:projectId/user/:username/roles')
  async getProjectUserAllRole(
    @Query('projectId') projectId: string,
    @Query('username') username: string,
  ) {
    return await this.permissionService.getProjectUserRoles(
      projectId,
      username,
    );
  }

  @Get('project/:projectId/roles/permissions')
  async getProjectAllRolePermissions(@Query('projectId') projectId: string) {
    return await this.permissionService.getProjectAllRolePermissions(projectId);
  }

  @Delete('project/:projectId/role/:name')
  async deleteRole(
    @Query('projectId') projectId: string,
    @Param('name') name: string,
  ) {
    await this.permissionService.deleteRole(projectId, name);
  }

  @Put('project/:projectId/role/:name')
  @ApiBody({ type: UpdateRoleDto })
  @UsePipes(new ValidationPipe())
  async updateRole(
    @Query('projectId') projectId: string,
    @Param('name') name: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.permissionService.updateRole(
      projectId,
      name,
      updateRoleDto.permissions,
    );
  }
}
