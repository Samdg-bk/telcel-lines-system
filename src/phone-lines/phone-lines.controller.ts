import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhoneLinesService } from './phone-lines.service';
import { CreatePhoneLineDto } from './dto/create-phone-line.dto';
import { UpdatePhoneLineDto } from './dto/update-phone-line.dto';

@Controller('phone-lines')
export class PhoneLinesController {
  constructor(private readonly phoneLinesService: PhoneLinesService) {}

  @Post()
  create(@Body() createPhoneLineDto: CreatePhoneLineDto) {
    return this.phoneLinesService.create(createPhoneLineDto);
  }

  @Get()
  findAll() {
    return this.phoneLinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phoneLinesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhoneLineDto: UpdatePhoneLineDto) {
    return this.phoneLinesService.update(id, updatePhoneLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phoneLinesService.remove(id);
  }
}
