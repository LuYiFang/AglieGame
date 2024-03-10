import { Module } from '@nestjs/common';
import { UserStoryController } from './user-story.controller';
import { UserStoryService } from './user-story.service';

@Module({
  controllers: [UserStoryController],
  providers: [UserStoryService],
})
export class UserStoryModule {}
