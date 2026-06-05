import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResponsivaDto } from './dto/create-responsiva.dto';
import { UpdateResponsivaDto } from './dto/update-responsiva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createWriteStream } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import PDFDocument = require('pdfkit');
import { Responsiva } from './entities/responsiva.entity';
import { Assignment } from '../assignments/entities/assignment.entity';

@Injectable()
export class ResponsivasService {
  private readonly pdfOutputDir = path.resolve(process.cwd(), 'generated', 'responsivas');

  constructor(
    @InjectRepository(Responsiva)
    private readonly responsivaRepository: Repository<Responsiva>,

    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
  ) {}

  async create(createResponsivaDto: CreateResponsivaDto) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: createResponsivaDto.assignmentId },
      relations: [
        'employee',
        'employee.company',
        'phoneLine',
        'phoneLine.company',
        'device',
        'device.company',
      ],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    const pdfPath = await this.generateResponsivaPdf(assignment, createResponsivaDto);

    const responsiva = this.responsivaRepository.create({
      assignment,
      generatedAt: createResponsivaDto.generatedAt ?? new Date(),
      signed: createResponsivaDto.signed ?? false,
      pdfPath,
      deliveredBy: createResponsivaDto.deliveredBy,
      department: createResponsivaDto.department,
      observations: createResponsivaDto.observations,
      signedAt: createResponsivaDto.signed ? createResponsivaDto.signedAt ?? new Date() : null,
    });

    return this.responsivaRepository.save(responsiva);
  }

  async findAll() {
    return this.responsivaRepository.find({
      relations: [
        'assignment',
        'assignment.employee',
        'assignment.employee.company',
        'assignment.phoneLine',
        'assignment.device',
      ],
    });
  }

  async findOne(id: string) {
    const responsiva = await this.responsivaRepository.findOne({
      where: { id },
      relations: [
        'assignment',
        'assignment.employee',
        'assignment.employee.company',
        'assignment.phoneLine',
        'assignment.device',
      ],
    });

    if (!responsiva) {
      throw new NotFoundException('Responsiva not found');
    }

    return responsiva;
  }

  async update(id: string, updateResponsivaDto: UpdateResponsivaDto) {
    const responsiva = await this.findOne(id);

    Object.assign(responsiva, updateResponsivaDto);

    if (typeof updateResponsivaDto.signed === 'boolean') {
      responsiva.signedAt = updateResponsivaDto.signed
        ? updateResponsivaDto.signedAt ?? new Date()
        : null;
    }

    return this.responsivaRepository.save(responsiva);
  }

  async uploadSignedPdf(
  id: string,
  file: Express.Multer.File,
) {

  const responsiva = await this.findOne(id);

  responsiva.signed = true;

  responsiva.signedAt = new Date();

  responsiva.signedPdfPath = file.path;

  responsiva.signedPdfName = file.originalname;

  return this.responsivaRepository.save(responsiva);
}

  async remove(id: string) {
    const responsiva = await this.findOne(id);

    return this.responsivaRepository.remove(responsiva);
  }

  getPdfAbsolutePath(filename: string) {
    return path.resolve(this.pdfOutputDir, filename);
  }

  private async generateResponsivaPdf(
    assignment: Assignment,
    createResponsivaDto: CreateResponsivaDto,
  ) {
    await fs.mkdir(this.pdfOutputDir, { recursive: true });

    const safeEmployeeName = (assignment.employee?.name ?? 'empleado')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const fileName = `responsiva-${safeEmployeeName || 'empleado'}-${assignment.id}.pdf`;
    const filePath = this.getPdfAbsolutePath(fileName);

    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'LETTER', margin: 50 });
      const stream = doc.pipe(createWriteStream(filePath));

      stream.on('finish', () => resolve());
      stream.on('error', reject);

      const companyName =
        assignment.employee?.company?.name ?? assignment.phoneLine?.company?.name ?? 'Industrial Organica S.A. de C.V.';
      const brand = assignment.device?.brand?.toUpperCase() ?? 'N/D';
      const model = assignment.device?.model ?? 'N/D';
      const imei = assignment.device?.imei ?? 'N/D';
      const employeeName = assignment.employee?.name ?? 'N/D';
      const deliveredBy =
        createResponsivaDto.deliveredBy?.trim() || 'Industrial Organica S.A. de C.V.';
      const department =
        createResponsivaDto.department?.trim() || assignment.employee?.position || 'N/D';
      const observations = createResponsivaDto.observations?.trim() || 'Sin observaciones.';
      const assignmentDate = assignment.startDate
        ? new Date(assignment.startDate).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : new Date().toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          });

      doc.fontSize(11).text(`Monterrey, N.L. a ${assignmentDate}`, { align: 'left' });
      doc.moveDown(2);
      doc.fontSize(16).text('CARTA RESPONSIVA', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(11).text(
        `Por medio de la presente doy por recibido como herramienta de trabajo un telefono marca ${brand} modelo ${model}, IMEI: ${imei}. El equipo que se detalla, mismo que firmo de conformidad, comprometiendome a mantenerlo en el estado en el que lo recibe cuidando de dicha herramienta como si el mismo fuera de mi propiedad, en el entendido de que en caso de que el mismo sufra cualquier daño ocasionado por dolo o negligencia me hare responsable de la reparacion o de sustituir el mismo.`,
        { align: 'justify' },
      );
      doc.moveDown(1.5);
      doc.text(
        'En caso de que, por causas inherentes al uso y desgaste normales del equipo, el mismo requiera cualquier reparacion, el que suscribe notificará tal circunstancia a la empresa para que la misma le indique las condiciones en las que las reparaciones o trabajo de mantenimiento sobre el mismo habran de realizarse.',
        { align: 'justify' },
      );
      doc.moveDown(1.5);
      doc.text(
        `El que suscribe reconoce que los derechos sobre el equipo objeto de la presente corresponden exclusivamente a ${companyName}. En terminos del contrato que tiene celebrado con la empresa por lo que, a la simple solicitud de esta, se le puede obligar al suscritor a devolver el equipo que se le entrega.`,
        { align: 'justify' },
      );
      
      
      doc.moveDown(4);
      doc.text('', { align: 'center' });
      doc.moveDown(2);

      
      doc.moveDown(2);
      doc.text('Recibi de Conformidad', { align: 'center' });
      doc.moveDown(4);
      doc.text('__________________________________', { align: 'center' });
      doc.text(employeeName, { align: 'center' });

      doc.end();
    });

    return `/responsivas/file/${fileName}`;
  }
}
