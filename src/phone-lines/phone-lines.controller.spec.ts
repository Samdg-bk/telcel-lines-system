import { Test, TestingModule } from '@nestjs/testing';
import { PhoneLinesController } from './phone-lines.controller';
import { PhoneLinesService } from './phone-lines.service';

describe('PhoneLinesController', () => {
  let controller: PhoneLinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneLinesController],
      providers: [PhoneLinesService],
    }).compile();

    controller = module.get<PhoneLinesController>(PhoneLinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
