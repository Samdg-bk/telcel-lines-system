import { Injectable } from '@nestjs/common';

import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

import { readFileSync } from 'fs';

import { parseStringPromise } from 'xml2js';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Factura } from './entities/factura.entity';

import AdmZip from 'adm-zip';

import * as fs from 'fs';

import * as path from 'path';

@Injectable()
export class FacturasService {

  constructor(

    @InjectRepository(Factura)
    private readonly facturaRepository:
      Repository<Factura>,

  ) {}

  async findAll() {

    return this.facturaRepository.find({

      order: {
        billingDate: 'DESC',
      },

    });
  }

  async processFactura(
    pdf?: Express.Multer.File,
    xml?: Express.Multer.File,
    telcelAccount?: string,
    
  ) 
  
  {

    if (!xml) {
      throw new Error('XML requerido');
    }

    // leer XML
    const xmlContent = readFileSync(
      xml.path,
      'utf-8',
    );

    // parsear XML
    const parsedXml =
      await parseStringPromise(xmlContent);

    // CFDI principal
    const comprobante =
      parsedXml['cfdi:Comprobante'];

    // emisor
    const emisor =
      comprobante['cfdi:Emisor'][0].$;

    // receptor
    const receptor =
      comprobante['cfdi:Receptor'][0].$;

    // UUID SAT
    const timbre =
      comprobante['cfdi:Complemento'][0]
      ['tfd:TimbreFiscalDigital'][0].$;

    // crear factura
    const factura =
      this.facturaRepository.create({

        uuid: timbre.UUID,

        telcelAccount,

        folio:
          comprobante.$.Serie +
          '-' +
          comprobante.$.Folio,

        accountNumber:
          receptor.Rfc,

        companyName:
          receptor.Nombre,

        companyRfc:
          receptor.Rfc,

        providerName:
          emisor.Nombre,

        providerRfc:
          emisor.Rfc,

        subtotal:
          Number(comprobante.$.SubTotal),

        total:
          Number(comprobante.$.Total),

        discount:
          Number(
            comprobante.$.Descuento ?? 0
          ),

        iva:
          Number(
            comprobante['cfdi:Impuestos']?.[0]
            ?.$?.TotalImpuestosTrasladados ?? 0
          ),

        currency:
          comprobante.$.Moneda,

        billingDate:
          new Date(comprobante.$.Fecha),

        pdfPath:
          pdf?.path.replace(/\\/g, '/')
          ?? '',

        xmlPath:
          xml.path.replace(/\\/g, '/'),

        rawConcepts:
          JSON.stringify(
            comprobante['cfdi:Conceptos']
          ),
      });

      

    // guardar en postgres
    const saved =
      await this.facturaRepository.save(
        factura,
      );

    return saved;
  }
async processZip(
  zipPath: string,
) {

  const extractPath =
    './uploads/temp/extracted';

  // limpiar carpeta
  fs.rmSync(
    extractPath,
    {
      recursive: true,
      force: true,
    },
  );

  fs.mkdirSync(
    extractPath,
    {
      recursive: true,
    },
  );

  // abrir ZIP
  const zip =
    new AdmZip(zipPath);

  // extraer
  zip.extractAllTo(
    extractPath,
    true,
  );

  // buscar archivos
  const files =
    this.getFilesRecursive(
      extractPath,
    );

  const xmlFiles =
    files.filter((f) =>
      f.endsWith('.xml')
    );

  const pdfFiles =
    files.filter((f) =>
      f.endsWith('.pdf')
    );

  let processed = 0;

  for (const xmlFile of xmlFiles) {

    

    try {

     const xmlName =
  path.basename(
    xmlFile,
    '.xml',
  );

const folio =
  xmlName.match(/\d+/)?.[0];

const pdfMatch =
  pdfFiles.find((p) =>
    folio
      ? path
          .basename(p)
          .includes(folio)
      : false
  );

console.log(
  'XML:',
  xmlName,
);

console.log(
  'FOLIO:',
  folio,
);

console.log(
  'PDF:',
  pdfMatch,
);

      // rutas finales
const finalXmlPath = path.join(
  'uploads/facturas/xml',
  path.basename(xmlFile),
);

fs.copyFileSync(
  xmlFile,
  finalXmlPath,
);

let finalPdfPath: string | undefined;

if (pdfMatch) {

  finalPdfPath = path.join(
    'uploads/facturas/pdf',
    path.basename(pdfMatch),
  );

  fs.copyFileSync(
    pdfMatch,
    finalPdfPath,
  );
}
const pathParts =
  xmlFile.split(path.sep);



const accountMatch =
  xmlName.match(
    /^CFDI_(\d+)/
  );

const telcelAccount =
  accountMatch?.[1];

console.log(
  'Cuenta Telcel:',
  telcelAccount,
);


await this.processFactura(
  finalPdfPath
    ? {
        path: finalPdfPath,
      } as Express.Multer.File
    : undefined,

  {
    path: finalXmlPath,
    filename:
      path.basename(finalXmlPath),
  } as Express.Multer.File,

  telcelAccount,
);

      processed++;

    } catch (error) {

      console.error(
        error,
      );
    }
  }

  return {

    message:
      'ZIP procesado',

    processed,
  };

  
}
getFilesRecursive(
  dir: string,
): string[] {

  let results: string[] = [];

  const files =
    fs.readdirSync(dir);

  for (const file of files) {

    const fullPath =
      path.join(dir, file);

    const stat =
      fs.statSync(fullPath);

    if (stat.isDirectory()) {

      results =
        results.concat(
          this.getFilesRecursive(
            fullPath,
          ),
        );

    } else {

      results.push(fullPath);

    }
  }

  return results;
}

async remove(id: string) {

  const factura =
    await this.facturaRepository.findOne({
      where: { id },
    });

  if (!factura) {
    throw new Error('Factura no encontrada');
  }

  // borrar PDF
  if (
    factura.pdfPath &&
    fs.existsSync(factura.pdfPath)
  ) {
    fs.unlinkSync(factura.pdfPath);
  }

  // borrar XML
  if (
    factura.xmlPath &&
    fs.existsSync(factura.xmlPath)
  ) {
    fs.unlinkSync(factura.xmlPath);
  }

  // borrar BD
  await this.facturaRepository.delete(id);

  return {
    message: 'Factura eliminada',
  };
}
  create(createFacturaDto: CreateFacturaDto) {
    return 'This action adds a new factura';
  }

  findOne(id: number) {
    return `This action returns a #${id} factura`;
  }

  update(
    id: number,
    updateFacturaDto: UpdateFacturaDto,
  ) {
    return `This action updates a #${id} factura`;
  }

}