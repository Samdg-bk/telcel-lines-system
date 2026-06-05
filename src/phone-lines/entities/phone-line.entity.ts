import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class PhoneLine {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phoneNumber: string;

  @Column()
  accountNumber: string;

  @Column()
  plan: string;

  @Column()
  companyId: string;

  @ManyToOne(() => Company, company => company.phoneLines)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ default: 'AVAILABLE' })
  status: string;
}