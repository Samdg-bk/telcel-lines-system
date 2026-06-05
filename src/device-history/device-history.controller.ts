import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DeviceHistoryService } from './device-history.service';
import { CreateDeviceHistoryDto } from './dto/create-device-history.dto';
import { UpdateDeviceHistoryDto } from './dto/update-device-history.dto';

@Controller('device-history')
export class DeviceHistoryController {
  constructor(private readonly deviceHistoryService: DeviceHistoryService) {}

  @Post()
  create(@Body() createDeviceHistoryDto: CreateDeviceHistoryDto) {
    return this.deviceHistoryService.create(createDeviceHistoryDto);
  }

  @Get()
  findAll() {
    return this.deviceHistoryService.findAll();
  }

  @Get('device/:id')
findByDevice(
  @Param('id') id: string,
) {
  return this.deviceHistoryService.findByDevice(id);
}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceHistoryDto: UpdateDeviceHistoryDto) {
    return this.deviceHistoryService.update(+id, updateDeviceHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceHistoryService.remove(+id);
  }
}
