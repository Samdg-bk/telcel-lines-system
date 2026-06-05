import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Company } from '../companies/entities/company.entity';

import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Company])],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
