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
  UseGuards,
  Request,
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
import { JwtGuard } from '../../jwt.guard';
import { Public } from '../../permission.decorator';

@UseGuards(JwtGuard)
@ApiTags('ability')
@Controller('ability')
export class AbilityController {
  constructor(private readonly abilityService: AbilityService) {}

  @Post('type')
  @ApiBody({ type: CreateAbilityTypeDto })
  @UsePipes(new ValidationPipe())
  createAbilityType(
    @Request() req,
    @Body() createAbilityDto: CreateAbilityTypeDto,
  ) {
    return this.abilityService.createAbilityType(req.user, createAbilityDto);
  }

  @Post('sub')
  @ApiBody({ type: CreateAbilitySubTypeDto })
  @UsePipes(new ValidationPipe())
  createAbilitySubType(
    @Request() req,
    @Body() createAbilitySubDto: CreateAbilitySubTypeDto,
  ) {
    return this.abilityService.createAbilitySubType(
      req.user,
      createAbilitySubDto,
    );
  }

  @Post('item')
  @ApiBody({ type: CreateAbilityItemDto })
  @UsePipes(new ValidationPipe())
  createAbilityItem(
    @Request() req,
    @Body() createAbilityItemDto: CreateAbilityItemDto,
  ) {
    return this.abilityService.createAbilityItemType(
      req.user,
      createAbilityItemDto,
    );
  }

  @Patch('')
  @ApiBody({ type: UpdateAbilityDto })
  @UsePipes(new ValidationPipe())
  updateAbility(@Request() req, @Body() updateAbilityDto: UpdateAbilityDto) {
    return this.abilityService.updateAbility(req.user, updateAbilityDto);
  }

  @Delete(
    'property/:username/:abilityTypeName/:abilitySubTypeName/:itemName/:property',
  )
  deleteProperty(
    @Request() req,
    @Param('username') username: string,
    @Param('abilityTypeName') abilityTypeName: string,
    @Param('abilitySubTypeName') abilitySubTypeName: string,
    @Param('itemName') itemName: string,
    @Param('property') property: string,
  ) {
    return this.abilityService.deleteProperty(req.user, {
      abilityTypeName,
      abilitySubTypeName,
      itemName,
      property,
    });
  }

  @Public()
  @Get(':username/all')
  findAll(@Param('username') username: string) {
    return this.abilityService.findAllByUser(username);
  }

  @Delete(':abilityTypeName')
  deleteType(
    @Request() req,
    // @Param('username') username: string,
    @Param('abilityTypeName') abilityTypeName: string,
  ) {
    return this.abilityService.deleteAbility(req.user, { abilityTypeName });
  }

  @Delete(':abilityTypeName/:abilitySubTypeName')
  deleteSubType(
    @Request() req,
    @Param('abilityTypeName') abilityTypeName: string,
    @Param('abilitySubTypeName') abilitySubTypeName: string,
  ) {
    return this.abilityService.deleteAbility(req.user, {
      abilityTypeName,
      abilitySubTypeName,
    });
  }

  @Delete(':abilityTypeName/:abilitySubTypeName/:itemName')
  deleteItem(
    @Request() req,
    @Param('abilityTypeName') abilityTypeName: string,
    @Param('abilitySubTypeName') abilitySubTypeName: string,
    @Param('itemName') itemName: string,
  ) {
    return this.abilityService.deleteAbility(req.user, {
      abilityTypeName,
      abilitySubTypeName,
      itemName,
    });
  }
}
