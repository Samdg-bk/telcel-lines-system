import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class Factura {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  uuid!: string;

  @Column()
  folio!: string;

  @Column()
  accountNumber!: string;

  @Column()
  companyName!: string;

  @Column()
  companyRfc!: string;

  @Column()
  providerName!: string;

  @Column()
  providerRfc!: string;

  @Column('decimal')
  subtotal!: number;

  @Column('decimal')
  total!: number;

  @Column('decimal')
  discount!: number;

  @Column('decimal')
  iva!: number;

  @Column()
  currency!: string;

  @Column()
  billingDate!: Date;

  @Column()
  pdfPath!: string;

  @Column()
  xmlPath!: string;

  @Column({ nullable: true })
  rawConcepts?: string;

  @Column({nullable: true,})
telcelAccount?: string;
}