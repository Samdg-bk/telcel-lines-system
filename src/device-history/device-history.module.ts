import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceHistory } from './entities/device-history.entity';
import { DeviceHistoryService } from './device-history.service';
import { DeviceHistoryController } from './device-history.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceHistory,
    ]),
  ],
  controllers: [DeviceHistoryController],
  providers: [DeviceHistoryService],
  exports: [TypeOrmModule],
})
export class DeviceHistoryModule {}