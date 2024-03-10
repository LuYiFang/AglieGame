import { Test, TestingModule } from '@nestjs/testing';
import { UserStoryService } from './user-story.service';

describe('UserStoryService', () => {
  let service: UserStoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStoryService],
    }).compile();

    service = module.get<UserStoryService>(UserStoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
