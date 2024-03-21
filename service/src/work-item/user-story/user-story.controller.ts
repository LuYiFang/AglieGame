import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserStoryService } from './user-story.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateWorkItemDto } from '../dto/work-item.dto';

@ApiTags('user-story')
@Controller('user-story')
export class UserStoryController {
  constructor(private readonly userStoryService: UserStoryService) {}

  @Post()
  @ApiBody({ type: CreateWorkItemDto })
  @UsePipes(new ValidationPipe())
  async createProject(@Body() createWorkItemDto: CreateWorkItemDto) {
    await this.userStoryService.createUserStory(
      createWorkItemDto.projectId,
      createWorkItemDto.username,
      createWorkItemDto.properties,
    );
  }

  @Get('project/:projectId')
  async getUserProject(@Param('projectId') projectId: string) {
    return await this.userStoryService.getProjectStories(projectId);
  }
}
