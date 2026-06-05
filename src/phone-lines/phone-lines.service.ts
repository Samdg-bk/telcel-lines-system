import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhoneLineDto } from './dto/create-phone-line.dto';
import { UpdatePhoneLineDto } from './dto/update-phone-line.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/entities/company.entity';
import { PhoneLine } from './entities/phone-line.entity';

@Injectable()
export class PhoneLinesService {

 constructor(
  @InjectRepository(PhoneLine)
  private readonly phoneLineRepository: Repository<PhoneLine>,

  @InjectRepository(Company)
  private readonly companyRepository: Repository<Company>,
) {}

  async create(createPhoneLineDto: CreatePhoneLineDto) {

  const company = await this.companyRepository.findOne({
    where: { id: createPhoneLineDto.companyId },
  });

  if (!company) {
    throw new NotFoundException('Company not found');
  }

  const phoneLine = this.phoneLineRepository.create({
    phoneNumber: createPhoneLineDto.phoneNumber,
    accountNumber: createPhoneLineDto.accountNumber,
    plan: createPhoneLineDto.plan,
    company: company,
  });

  return this.phoneLineRepository.save(phoneLine);
}

  async findAll() {
    return this.phoneLineRepository.find({
      relations: ['company'],
    });
  }

  async findOne(id: string) {
    const phoneLine = await this.phoneLineRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!phoneLine) {
      throw new NotFoundException('Phone line not found');
    }

    return phoneLine;
  }

  async update(id: string, updatePhoneLineDto: UpdatePhoneLineDto) {
    const phoneLine = await this.findOne(id);

    Object.assign(phoneLine, updatePhoneLineDto);

    return this.phoneLineRepository.save(phoneLine);
  }

  async remove(id: string) {
    const phoneLine = await this.findOne(id);

    return this.phoneLineRepository.remove(phoneLine);
  }
}