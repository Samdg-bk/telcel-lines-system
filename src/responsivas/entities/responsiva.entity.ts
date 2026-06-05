import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Assignment } from '../../assignments/entities/assignment.entity';

@Entity()
export class Responsiva {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Assignment)
  assignment!: Assignment;

  @Column({ type: 'timestamp' })
  generatedAt!: Date;

  @Column({ default: false })
  signed!: boolean;

  @Column()
  pdfPath!: string;

  @Column({ nullable: true })
  signedPdfPath?: string;

  @Column({ nullable: true })
  signedPdfName?: string;

  @Column({ nullable: true })
  deliveredBy?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true, type: 'text' })
  observations?: string;

  @Column({ type: 'timestamp', nullable: true })
  signedAt?: Date | null;
}
