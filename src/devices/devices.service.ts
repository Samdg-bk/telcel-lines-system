import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Device } from './entities/device.entity';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class DevicesService {

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {

    let company: Company | null = null;

    if (createDeviceDto.companyId) {
      company = await this.companyRepository.findOne({
        where: { id: createDeviceDto.companyId },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }
    }

    // VALIDACION IMEI DUPLICADO
    if (createDeviceDto.imei) {

      const existingDevice = await this.deviceRepository.findOne({
        where: { imei: createDeviceDto.imei },
      });

      if (existingDevice) {
        throw new BadRequestException(
          'Ya existe un dispositivo con ese IMEI'
        );
      }
    }

    const device = this.deviceRepository.create({
      brand: createDeviceDto.brand,
      model: createDeviceDto.model,
      imei: createDeviceDto.imei,
      serialNumber: createDeviceDto.serialNumber,
      status: createDeviceDto.status ?? 'AVAILABLE',
      notes: createDeviceDto.notes,
      company: company ?? undefined,
    });

    return this.deviceRepository.save(device);
  }

  async createBulk(createDevicesDto: CreateDeviceDto[]) {

    const results = {
      created: 0,
      errors: [] as Array<{ row: number; message: string }>,
    };

    for (const [index, createDeviceDto] of createDevicesDto.entries()) {

      try {

        if (
          !createDeviceDto.brand ||
          !createDeviceDto.model
        ) {
          throw new NotFoundException(
            'brand and model are required'
          );
        }

        await this.create({
          ...createDeviceDto,
          status: createDeviceDto.status ?? 'AVAILABLE',
        });

        results.created += 1;

      } catch (error) {

        const message =
          error instanceof Error
            ? error.message
            : 'Unknown error creating device';

        results.errors.push({
          row: index + 2,
          message,
        });
      }
    }

    return results;
  }

  async findAll() {

    return this.deviceRepository.find({
      relations: ['company'],
    });
  }

  async findOne(id: string) {

    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    return device;
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {

    const device = await this.findOne(id);

    if (updateDeviceDto.companyId) {

      const company = await this.companyRepository.findOne({
        where: { id: updateDeviceDto.companyId },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      device.company = company;
    }

    // VALIDAR IMEI DUPLICADO EN UPDATE
    if (
      updateDeviceDto.imei &&
      updateDeviceDto.imei !== device.imei
    ) {

      const existingDevice = await this.deviceRepository.findOne({
        where: { imei: updateDeviceDto.imei },
      });

      if (existingDevice) {
        throw new BadRequestException(
          'Ya existe un dispositivo con ese IMEI'
        );
      }
    }

    device.brand = updateDeviceDto.brand ?? device.brand;
    device.model = updateDeviceDto.model ?? device.model;
    device.imei = updateDeviceDto.imei ?? device.imei;
    device.serialNumber =
      updateDeviceDto.serialNumber ?? device.serialNumber;
    device.status = updateDeviceDto.status ?? device.status;
    device.notes = updateDeviceDto.notes ?? device.notes;

    return this.deviceRepository.save(device);
  }

  async remove(id: string) {
    return this.deviceRepository.softDelete(id);
  }
}
