import { Test, TestingModule } from '@nestjs/testing';
import { DeviceHistoryController } from './device-history.controller';
import { DeviceHistoryService } from './device-history.service';

describe('DeviceHistoryController', () => {
  let controller: DeviceHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceHistoryController],
      providers: [DeviceHistoryService],
    }).compile();

    controller = module.get<DeviceHistoryController>(DeviceHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
