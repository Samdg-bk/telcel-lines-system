import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import type { Response } from 'express';
import { ResponsivasService } from './responsivas.service';
import { CreateResponsivaDto } from './dto/create-responsiva.dto';
import { UpdateResponsivaDto } from './dto/update-responsiva.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('responsivas')
export class ResponsivasController {
  constructor(private readonly responsivasService: ResponsivasService) {}

  @Post()
  create(@Body() createResponsivaDto: CreateResponsivaDto) {
    return this.responsivasService.create(createResponsivaDto);
  }

  @Get()
  findAll() {
    return this.responsivasService.findAll();
  }

  @Get('file/:filename')
  downloadFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const filePath = this.responsivasService.getPdfAbsolutePath(filename);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    return new StreamableFile(createReadStream(filePath));
  }
  @Post(':id/upload-signed')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/responsivas',

      filename: (req, file, callback) => {

        const uniqueSuffix =
          Date.now() + '-' + Math.round(Math.random() * 1e9);

        callback(
          null,
          uniqueSuffix + extname(file.originalname),
        );
      },
    }),
  }),
)
async uploadSignedPdf(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
) {

  return this.responsivasService.uploadSignedPdf(
    id,
    file,
  );
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsivasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResponsivaDto: UpdateResponsivaDto) {
    return this.responsivasService.update(id, updateResponsivaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsivasService.remove(id);
  }
}
