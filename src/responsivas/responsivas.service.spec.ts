import { Test, TestingModule } from '@nestjs/testing';
import { ResponsivasService } from './responsivas.service';

describe('ResponsivasService', () => {
  let service: ResponsivasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponsivasService],
    }).compile();

    service = module.get<ResponsivasService>(ResponsivasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
