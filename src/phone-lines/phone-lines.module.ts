import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PhoneLinesService } from './phone-lines.service';
import { PhoneLinesController } from './phone-lines.controller';

import { PhoneLine } from './entities/phone-line.entity';
import { Company } from '../companies/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PhoneLine,
      Company,
    ]),
  ],
  controllers: [PhoneLinesController],
  providers: [PhoneLinesService],
  exports: [PhoneLinesService],
})
export class PhoneLinesModule {}