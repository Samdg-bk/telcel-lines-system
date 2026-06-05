import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create(createCompanyDto);
    return this.companyRepository.save(company);
  }

  async findAll() {
    return this.companyRepository.find();
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);

    Object.assign(company, updateCompanyDto);

    return this.companyRepository.save(company);
  }

  async remove(id: string) {
    const company = await this.findOne(id);

    return this.companyRepository.remove(company);
  }
}