import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';
import { PhoneLinesModule } from './phone-lines/phone-lines.module';
import { DevicesModule } from './devices/devices.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { ResponsivasModule } from './responsivas/responsivas.module';
import { FacturasModule } from './facturas/facturas.module';
import { IaModule } from './ia/ia.module';
import { DeviceHistoryModule } from './device-history/device-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),

    CompaniesModule,
    EmployeesModule,
    PhoneLinesModule,
    DevicesModule,
    AssignmentsModule,
    ResponsivasModule,
    FacturasModule,
    IaModule,
    DeviceHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}