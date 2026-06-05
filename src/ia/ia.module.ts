import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { IaController } from './ia.controller';

import { EmployeesModule } from '../employees/employees.module';
import { DevicesModule } from '../devices/devices.module';
import { PhoneLinesModule } from '../phone-lines/phone-lines.module';
import { FacturasModule } from '../facturas/facturas.module';

@Module({
  imports: [
    EmployeesModule,
    DevicesModule,
    PhoneLinesModule,
    FacturasModule,
  ],
  controllers: [IaController],
  providers: [IaService],
})
export class IaModule {}