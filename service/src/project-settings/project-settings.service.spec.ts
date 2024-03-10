import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSettingsService } from './project-settings.service';

describe('ProjectSettingsService', () => {
  let service: ProjectSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectSettingsService],
    }).compile();

    service = module.get<ProjectSettingsService>(ProjectSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
