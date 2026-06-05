import { Injectable } from '@nestjs/common';
import { CreateDeviceHistoryDto } from './dto/create-device-history.dto';
import { UpdateDeviceHistoryDto } from './dto/update-device-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceHistory } from './entities/device-history.entity';

@Injectable()
export class DeviceHistoryService {

  constructor(
    @InjectRepository(DeviceHistory)
    private readonly deviceHistoryRepository:
      Repository<DeviceHistory>,
  ) {}

  async findByDevice(deviceId: string) {
    return this.deviceHistoryRepository.find({
      where: {
        device: {
          id: deviceId,
        },
      },
      relations: [
        'employee',
        'device',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  create(createDeviceHistoryDto: CreateDeviceHistoryDto) {
    return 'This action adds a new deviceHistory';
  }

  findAll() {
    return `This action returns all deviceHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deviceHistory`;
  }

  update(id: number, updateDeviceHistoryDto: UpdateDeviceHistoryDto) {
    return `This action updates a #${id} deviceHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} deviceHistory`;
  }
}