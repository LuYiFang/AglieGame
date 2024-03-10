import { Test, TestingModule } from '@nestjs/testing';
import { UserStoryController } from './user-story.controller';

describe('UserStoryController', () => {
  let controller: UserStoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStoryController],
    }).compile();

    controller = module.get<UserStoryController>(UserStoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
