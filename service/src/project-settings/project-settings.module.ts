import { Module } from '@nestjs/common';
import { ProjectSettingsController } from './project-settings.controller';
import { ProjectSettingsService } from './project-settings.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  controllers: [ProjectSettingsController],
  providers: [ProjectSettingsService],
})
export class ProjectSettingsModule {}
