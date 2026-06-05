import { Test, TestingModule } from '@nestjs/testing';
import { PhoneLinesService } from './phone-lines.service';

describe('PhoneLinesService', () => {
  let service: PhoneLinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneLinesService],
    }).compile();

    service = module.get<PhoneLinesService>(PhoneLinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
