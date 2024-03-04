import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsObject } from 'class-validator';
import { Porperties } from '../interfaces/project.interface';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  username: string = '';

  @ApiProperty()
  @IsString()
  name: string = '';

  @ApiProperty()
  @IsObject()
  properties: Porperties = {};
}
