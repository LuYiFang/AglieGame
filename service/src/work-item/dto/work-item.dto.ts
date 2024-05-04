import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsObject } from 'class-validator';
import { Properties } from '../../common/interfaces/common.interface';

export class CreateWorkItemDto {
  @ApiProperty()
  @IsString()
  username: string = '';

  @ApiProperty()
  @IsString()
  projectId: string = '';

  @ApiProperty()
  @IsObject()
  properties: Properties = {};
}
