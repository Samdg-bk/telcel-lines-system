import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { DeleteDateColumn } from 'typeorm';

@Entity()
export class Device {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

 @Column({ unique: true, nullable: true })
  imei!: string;

  @Column({ nullable: true })
  serialNumber!: string;

  @Column({ nullable: true })
  companyId!: string;

  @ManyToOne(() => Company, (company) => company.devices)
  @JoinColumn({ name: 'companyId' })
  company!: Company;

  @Column({ default: 'AVAILABLE' })
  status!: string;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @DeleteDateColumn()
deletedAt?: Date;
}
