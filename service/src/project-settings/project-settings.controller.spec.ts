import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSettingsController } from './project-settings.controller';

describe('ProjectSettingsController', () => {
  let controller: ProjectSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectSettingsController],
    }).compile();

    controller = module.get<ProjectSettingsController>(
      ProjectSettingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
