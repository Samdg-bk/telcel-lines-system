import { Test, TestingModule } from '@nestjs/testing';
import { ResponsivasController } from './responsivas.controller';
import { ResponsivasService } from './responsivas.service';

describe('ResponsivasController', () => {
  let controller: ResponsivasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsivasController],
      providers: [ResponsivasService],
    }).compile();

    controller = module.get<ResponsivasController>(ResponsivasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
