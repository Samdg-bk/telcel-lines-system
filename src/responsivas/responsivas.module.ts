import { Module } from '@nestjs/common';
import { ResponsivasService } from './responsivas.service';
import { ResponsivasController } from './responsivas.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { Responsiva } from './entities/responsiva.entity';
import { Assignment } from '../assignments/entities/assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Responsiva, Assignment])],
  controllers: [ResponsivasController],
  providers: [ResponsivasService],
})
export class ResponsivasModule {}
