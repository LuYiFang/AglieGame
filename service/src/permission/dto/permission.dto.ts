import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  projectId: string = '';

  @ApiProperty()
  @IsNotEmpty()
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
