import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from './entities/employee.entity';
import { Company } from 'src/companies/entities/company.entity';

@Injectable()
export class EmployeesService {

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

 async create(createEmployeeDto: CreateEmployeeDto) {

  const company = await this.companyRepository.findOne({
    where: { id: createEmployeeDto.companyId }
  });

  if (!company) {
    throw new NotFoundException("Company not found");
  }

  const employee = this.employeeRepository.create({
    name: createEmployeeDto.name,
    email: createEmployeeDto.email,
    position: createEmployeeDto.position,
    company: company
  });

  return this.employeeRepository.save(employee);
}

  async findAll() {
    return this.employeeRepository.find({
      relations: ['company'],
    });
  }

  async findOne(id: string) {

    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {

    const employee = await this.findOne(id);

    if (updateEmployeeDto.companyId) {

      const company = await this.companyRepository.findOne({
        where: { id: updateEmployeeDto.companyId },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      employee.company = company;
    }

    employee.name = updateEmployeeDto.name ?? employee.name;
    employee.email = updateEmployeeDto.email ?? employee.email;
    employee.position = updateEmployeeDto.position ?? employee.position;

    return this.employeeRepository.save(employee);
  }

  async remove(id: string) {

    const employee = await this.findOne(id);

    return this.employeeRepository.remove(employee);
  }
}