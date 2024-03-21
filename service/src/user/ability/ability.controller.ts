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
  CreateAbilityItemDto,
  CreateAbilitySubTypeDto,
  CreateAbilityTypeDto,
} from './dto/create-ability.dto';
import { UpdateAbilityDto } from './dto/update-ability.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('ability')
@Controller('ability')
export class AbilityController {
  constructor(private readonly abilityService: AbilityService) {}

  @Post()
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

  @Get()
  findAll() {
    return this.abilityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abilityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAbilityDto: UpdateAbilityDto) {
    return this.abilityService.update(+id, updateAbilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.abilityService.remove(+id);
  }
}
