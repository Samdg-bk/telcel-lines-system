import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FacturasService } from './facturas.service';

import { CreateFacturaDto } from './dto/create-factura.dto';

import { UpdateFacturaDto } from './dto/update-factura.dto';

import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname } from 'path';

@Controller('facturas')
export class FacturasController {

  constructor(
    private readonly facturasService:
      FacturasService,
  ) {}

  @Post('upload')

  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pdf', maxCount: 1 },
        { name: 'xml', maxCount: 1 },
      ],
      {
        storage: diskStorage({

          destination:
            (req, file, callback) => {

              if (
                file.mimetype.includes(
                  'pdf',
                )
              ) {

                callback(
                  null,
                  './uploads/facturas/pdf',
                );

              } else {

                callback(
                  null,
                  './uploads/facturas/xml',
                );
              }
            },

          filename:
            (req, file, callback) => {

              const uniqueSuffix =

                Date.now() +
                '-' +
                Math.round(
                  Math.random() * 1e9,
                );

              callback(
                null,
                uniqueSuffix +
                  extname(
                    file.originalname,
                  ),
              );
            },
        }),
      },
    ),
  )

  async uploadFactura(

    @UploadedFiles()
    files: {
      pdf?: Express.Multer.File[];
      xml?: Express.Multer.File[];
    },
  ) {

    return this.facturasService
      .processFactura(
        files.pdf?.[0],
        files.xml?.[0],
      );
  }

  @Post('upload-zip')

  @UseInterceptors(
    FileInterceptor(
      'zip',
      {
        storage: diskStorage({

          destination:
            './uploads/temp',

          filename:
            (
              req,
              file,
              callback,
            ) => {

              callback(
                null,
                Date.now() +
                  '-' +
                  file.originalname,
              );
            },
        }),
      },
    ),
  )

  async uploadZip(

    @UploadedFile()
    zipFile: Express.Multer.File,
  ) {

    return this.facturasService
      .processZip(
        zipFile.path,
      );
  }

  @Get()

  findAll() {

    return this.facturasService
      .findAll();
  }

  @Get(':id')

  findOne(
    @Param('id')
    id: string,
  ) {

    return this.facturasService
      .findOne(+id);
  }

  @Patch(':id')

  update(

    @Param('id')
    id: string,

    @Body()
    updateFacturaDto:
      UpdateFacturaDto,
  ) {

    return this.facturasService
      .update(
        +id,
        updateFacturaDto,
      );
  }

  @Delete(':id')

  remove(
    @Param('id')
    id: string,
  ) {

    return this.facturasService
      .remove(id);
  }
}