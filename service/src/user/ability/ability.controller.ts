import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AbilityService } from './ability.service';
import {
  AbilityDto,
  CreateAbilityItemDto,
  CreateAbilitySubTypeDto,
  CreateAbilityTypeDto,
  UpdateAbilityDto,
} from './dto/create-ability.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('ability')
@Controller('ability')
export class AbilityController {
  constructor(private readonly abilityService: AbilityService) {}

  @Post('type')
  @ApiBody({ type: CreateAbilityTypeDto })
  @UsePipes(new ValidationPipe())
  createAbilityType(@Body() createAbilityDto: CreateAbilityTypeDto) {
    return this.abilityService.createAbilityType(createAbilityDto);
  }

  @Post('sub')
  @ApiBody({ type: CreateAbilitySubTypeDto })
  @UsePipes(new ValidationPipe())
  createAbilitySubType(@Body() createAbilitySubDto: CreateAbilitySubTypeDto) {
    return this.abilityService.createAbilitySubType(createAbilitySubDto);
  }

  @Post('item')
  @ApiBody({ type: CreateAbilityItemDto })
  @UsePipes(new ValidationPipe())
  createAbilityItem(@Body() createAbilityItemDto: CreateAbilityItemDto) {
    return this.abilityService.createAbilityItemType(createAbilityItemDto);
  }

  @Patch('')
  @ApiBody({ type: UpdateAbilityDto })
  @UsePipes(new ValidationPipe())
  updateAbility(@Body() updateAbilityDto: UpdateAbilityDto) {
    return this.abilityService.updateAbility(updateAbilityDto);
  }

  // @Patch('name')
  // @ApiBody({ type: UpdateAbilityNameDto })
  // @UsePipes(new ValidationPipe())
  // update(@Body() updateAbilityNameDto: UpdateAbilityNameDto) {
  //   return this.abilityService.updateAbilityName(updateAbilityNameDto);
  // }

  @Delete(
    'property/:username/:abilityTypeName/:abilitySubTypeName/:itemName/:property',
  )
  deleteProperty(
    @Param('username') username: string,
    @Param('abilityTypeName') abilityTypeName: string,
    @Param('abilitySubTypeName') abilitySubTypeName: string,
    @Param('itemName') itemName: string,
    @Param('property') property: string,
  ) {
    return this.abilityService.deleteProperty({
      username,
      abilityTypeName,
      abilitySubTypeName,
      itemName,
      property,
    });
  }

  @Get(':username/all')
  findAll(@Param('username') username: string) {
    return this.abilityService.findAllByUser(username);
  }

  @Delete(':username/:abilityTypeName')
  deleteType(
    @Param('username') username: string,
    @Param('abilityTypeName') abilityTypeName: string,
  ) {
    return this.abilityService.deleteAbility({ username, abilityTypeName });
  }

  @Delete(':username/:abilityTypeName/:abilitySubTypeName')
  deleteSubType(
    @Param('username') username: string,
    @Param('abilityTypeName') abilityTypeName: string,
    @Param('abilitySubTypeName') abilitySubTypeName: string,
  ) {
    return this.abilityService.deleteAbility({
      username,
      abilityTypeName,
      abilitySubTypeName,
    });
  }

  @Delete(':username/:abilityTypeName/:abilitySubTypeName/:itemName')
  deleteItem(
    @Param('username') username: string,
    @Param('abilityTypeName') abilityTypeName: string,
    @Param('abilitySubTypeName') abilitySubTypeName: string,
    @Param('itemName') itemName: string,
  ) {
    return this.abilityService.deleteAbility({
      username,
      abilityTypeName,
      abilitySubTypeName,
      itemName,
    });
  }
}
