import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Properties } from '../../../common/interfaces/common.interface';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAbilityTypeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  properties: Properties;
}

export class CreateAbilitySubTypeDto {
  @ApiProperty()
  @IsString()
  abilityTypeName: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  properties: Properties;
}

export class CreateAbilityItemDto {
  @ApiProperty()
  @IsString()
  abilityTypeName: string;

  @ApiProperty()
  @IsString()
  abilitySubTypeName: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  properties: Properties;
}

export class AbilityDto {
  @ApiPropertyOptional()
  @IsOptional()
  abilityTypeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  abilitySubTypeName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  itemName?: string;
}

export class UpdateAbilityDto {
  @ApiProperty()
  @IsString()
  propertyName: string;

  @ApiProperty()
  propertyValue: any;

  @ApiPropertyOptional()
  @IsOptional()
  abilityTypeName: string;

  @ApiPropertyOptional()
  @IsOptional()
  abilitySubTypeName: string;

  @ApiPropertyOptional()
  @IsOptional()
  itemName: string;
}

export class DeleteAbilityPropertyDto {
  @ApiProperty()
  @IsString()
  property: string;

  @ApiPropertyOptional()
  @IsOptional()
  abilityTypeName: string;

  @ApiPropertyOptional()
  @IsOptional()
  abilitySubTypeName: string;

  @ApiPropertyOptional()
  @IsOptional()
  itemName: string;
}
