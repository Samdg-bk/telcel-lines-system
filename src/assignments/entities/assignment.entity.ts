import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { PhoneLine } from '../../phone-lines/entities/phone-line.entity';
import { Device } from '../../devices/entities/device.entity';

@Entity()
export class Assignment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Employee)
  employee: Employee;

  @ManyToOne(() => PhoneLine)
  phoneLine: PhoneLine;

  @ManyToOne(() => Device)
  device: Device;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null;

  @Column({ default: true })
  active: boolean;
}
