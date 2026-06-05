import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class Employee {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  position: string;

  @ManyToOne(() => Company, company => company.employees)
  company: Company;

}