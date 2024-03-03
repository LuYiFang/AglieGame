import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
      createRoleDto.name,
      createRoleDto.permissions,
    );
  }

  @Get('role')
  async getAllRole() {
    return await this.permissionService.getAllRoles();
  }

  @Get('role/:name')
  async getRolePermissions(@Param('name') name: string) {
    return await this.permissionService.getRolePermissions(name);
  }

  @Delete('role/:name')
  async deleteRole(@Param('name') name: string) {
    await this.permissionService.deleteRole(name);
  }

  @Put('role/:name')
  @ApiBody({ type: UpdateRoleDto })
  @UsePipes(new ValidationPipe())
  async updateRole(
    @Param('name') name: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    await this.permissionService.updateRole(name, updateRoleDto.permissions);
  }
}
