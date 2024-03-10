import { Module } from '@nestjs/common';
import { UserStoryController } from './user-story.controller';
import { UserStoryService } from './user-story.service';
import { PermissionModule } from '../../permission/permission.module';
import { ProjectModule } from '../../project/project.module';

@Module({
  imports: [PermissionModule, ProjectModule],
  controllers: [UserStoryController],
  providers: [UserStoryService],
})
export class UserStoryModule {}
