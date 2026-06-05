import { Employee } from 'src/employees/entities/employee.entity';
import { Device } from 'src/devices/entities/device.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('device_history')
export class DeviceHistory {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Device)
  device!: Device;

  @ManyToOne(() => Employee)
  employee!: Employee;

 @Column()
action!: string;


  @Column({ nullable: true })
  notes!: string;

  @CreateDateColumn()
  createdAt!: Date;
}