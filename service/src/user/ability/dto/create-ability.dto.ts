import { ApiProperty } from '@nestjs/swagger';
import { Porperties } from '../../../common/interfaces/common.interface';
import { IsObject, IsString } from 'class-validator';

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
