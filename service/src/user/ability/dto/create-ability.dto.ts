import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Porperties } from '../../../common/interfaces/common.interface';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAbilityTypeDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  properties: Porperties;
}

export class CreateAbilitySubTypeDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  abilityTypeName: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsObject()
  properties: Porperties;
}

export class CreateAbilityItemDto {
  @ApiProperty()
  @IsString()
  username: string;

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
  properties: Porperties;
}

export class AbilityDto {
  @ApiProperty()
  @IsString()
  username: string;

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
  username: string;

  // @ApiProperty()
  // @IsString()
  // name: string;

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
  username: string;

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

// export class UpdateAbilityNameDto {
//   @ApiProperty()
//   @IsString()
//   username: string;

//   @ApiProperty()
//   @IsString()
//   name: string;

//   @ApiProperty()
//   @IsString()
//   newName: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   abilityTypeName: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   abilitySubTypeName: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   itemName: string;
// }
