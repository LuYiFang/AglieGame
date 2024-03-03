import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  name: string = '';

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  permissions: Array<string> = [];
}

export class UpdateRoleDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  permissions: Array<string> = [];
}
