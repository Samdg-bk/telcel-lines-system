import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Assignment } from './entities/assignment.entity';
import { Employee } from '../employees/entities/employee.entity';
import { PhoneLine } from '../phone-lines/entities/phone-line.entity';
import { Device } from '../devices/entities/device.entity';
import { DeviceHistory } from '../device-history/entities/device-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Assignment,
      Employee,
      PhoneLine,
      Device,
      DeviceHistory,
    ]),
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}