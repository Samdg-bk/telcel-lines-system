import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { PhoneLine } from '../../phone-lines/entities/phone-line.entity';
import { Device } from '../../devices/entities/device.entity';

@Entity()
export class Company {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  legalName: string;

  @Column()
  rfc: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  logo?: string;

  @OneToMany(() => Employee, employee => employee.company)
  employees: Employee[];

  @OneToMany(() => PhoneLine, line => line.company)
  phoneLines: PhoneLine[];

  @OneToMany(() => Device, device => device.company)
devices: Device[];

}