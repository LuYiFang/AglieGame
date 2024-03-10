import { Module } from '@nestjs/common';
import { WorkItemService } from './work-item.service';
import { WorkItemController } from './work-item.controller';
import { UserStoryModule } from './user-story/user-story.module';

@Module({
  providers: [WorkItemService],
  controllers: [WorkItemController],
  imports: [UserStoryModule],
})
export class WorkItemModule {}
