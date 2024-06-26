import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsObject, IsNotEmpty } from 'class-validator';
import { Properties } from '../../common/interfaces/common.interface';
import { ExcludePropertyValues } from '../../common/decorators/extract-neo4j-record.decorator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string = '';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @ApiProperty()
  @IsObject()
  properties: Properties = {};
}

export class UpdatePropertyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ExcludePropertyValues(['uuid', 'createdBy'])
  propertyName: string = '';
}

export class UpdatePropertyValueDto extends UpdatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  propertyValue: any = '';
}

export class UpdatePropertyNameDto extends UpdatePropertyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ExcludePropertyValues(['uuid', 'createdBy'])
  newPropertyName: string = '';
}

export class UpdateProjectDto {
  @ApiProperty()
  @IsObject()
  properties: Properties = {};
}
