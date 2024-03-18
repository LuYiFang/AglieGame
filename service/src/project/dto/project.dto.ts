import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsObject } from 'class-validator';
import { Porperties } from '../../common/interfaces/common.interface';
import { ExcludePropertyValues } from '../../common/decorators/extract-neo4j-record.decorator';

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

export class UpdatePropertyDto {
  @ApiProperty()
  @IsString()
  username: string = '';

  @ApiProperty()
  @IsString()
  @ExcludePropertyValues(['uuid', 'createdBy'])
  propertyName: string = '';
}

export class UpdatePropertyValueDto extends UpdatePropertyDto {
  @ApiProperty()
  propertyValue: any = '';
}

export class UpdatePropertyNameDto extends UpdatePropertyDto {
  @ApiProperty()
  @IsString()
  @ExcludePropertyValues(['uuid', 'createdBy'])
  newPropertyName: string = '';
}

export class UpdateProjectDto {
  @ApiProperty()
  @IsString()
  username: string = '';

  @ApiProperty()
  @IsObject()
  properties: Porperties = {};
}
