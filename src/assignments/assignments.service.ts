import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { Employee } from '../employees/entities/employee.entity';
import { PhoneLine } from '../phone-lines/entities/phone-line.entity';
import { Device } from '../devices/entities/device.entity';
import { DeviceHistory } from 'src/device-history/entities/device-history.entity';


@Injectable()
export class AssignmentsService {
  constructor(

    @InjectRepository(DeviceHistory)
private readonly deviceHistoryRepository:
  Repository<DeviceHistory>,

    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(PhoneLine)
    private readonly phoneLineRepository: Repository<PhoneLine>,

    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async findCurrentAssignment(deviceId: string) {

  const assignment =
    await this.assignmentRepository.findOne({
      where: {
        active: true,
        device: {
          id: deviceId,
        },
      },
      relations: [
        'employee',
        'device',
        'phoneLine',
      ],
    });

  return assignment ?? null;
}

  async create(createAssignmentDto: CreateAssignmentDto) {
    const existingAssignments = await this.assignmentRepository.find({
      where: { active: true },
      relations: ['employee', 'phoneLine', 'device'],
    });

    const employee = await this.employeeRepository.findOne({
      where: { id: createAssignmentDto.employeeId },
      relations: ['company'],
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const phoneLine = await this.phoneLineRepository.findOne({
      where: { id: createAssignmentDto.phoneLineId },
      relations: ['company'],
    });

    if (!phoneLine) {
      throw new NotFoundException('Phone line not found');
    }

    const device = await this.deviceRepository.findOne({
      where: { id: createAssignmentDto.deviceId },
      relations: ['company'],
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    const employeeHasAssignment = existingAssignments.some(
      (assignment) => assignment.employee?.id === employee.id,
    );

    if (employeeHasAssignment) {
      throw new BadRequestException('Employee already has an active assignment');
    }

    const lineHasAssignment = existingAssignments.some(
      (assignment) => assignment.phoneLine?.id === phoneLine.id,
    );

    if (lineHasAssignment || phoneLine.status === 'ASSIGNED') {
      throw new BadRequestException('Phone line is already assigned');
    }

    const deviceHasAssignment = existingAssignments.some(
      (assignment) => assignment.device?.id === device.id,
    );

    if (deviceHasAssignment || device.status === 'ASSIGNED') {
      throw new BadRequestException('Device is already assigned');
    }

    const assignment = this.assignmentRepository.create({
      employee,
      phoneLine,
      device,
      startDate: createAssignmentDto.startDate ?? new Date(),
      endDate: createAssignmentDto.endDate ?? null,
      active: createAssignmentDto.active ?? true,
    });

    phoneLine.status = 'ASSIGNED';
    device.status = 'ASSIGNED';

    await this.phoneLineRepository.save(phoneLine);
    await this.deviceRepository.save(device);
await this.deviceHistoryRepository.save({
  device,
  employee,
  action: 'ASSIGNED',
  notes: 'Asignación inicial',
});

return this.assignmentRepository.save(assignment);
  }

  async findAll() {
    return this.assignmentRepository.find({
      relations: ['employee', 'employee.company', 'phoneLine', 'phoneLine.company', 'device', 'device.company'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['employee', 'employee.company', 'phoneLine', 'phoneLine.company', 'device', 'device.company'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    const assignment = await this.findOne(id);

    if (typeof updateAssignmentDto.active === 'boolean') {
      assignment.active = updateAssignmentDto.active;

       if (!updateAssignmentDto.active) {
        assignment.endDate = updateAssignmentDto.endDate ?? new Date();

        await this.deviceHistoryRepository.save({
  device: assignment.device,
  employee: assignment.employee,
  action: 'RELEASED',
  notes: 'Asignación liberada',
});

        if (assignment.phoneLine) {
          assignment.phoneLine.status = 'AVAILABLE';
          await this.phoneLineRepository.save(assignment.phoneLine);
        }

        if (assignment.device) {
          assignment.device.status = 'AVAILABLE';
          await this.deviceRepository.save(assignment.device);
        }
      }
    }

    if (updateAssignmentDto.startDate) {
      assignment.startDate = updateAssignmentDto.startDate;
    }

    if (updateAssignmentDto.endDate) {
      assignment.endDate = updateAssignmentDto.endDate;
    }

    return this.assignmentRepository.save(assignment);
  }

  async remove(id: string) {
    const assignment = await this.findOne(id);

    if (assignment.phoneLine) {
      assignment.phoneLine.status = 'AVAILABLE';
      await this.phoneLineRepository.save(assignment.phoneLine);
    }

    if (assignment.device) {
      assignment.device.status = 'AVAILABLE';
      await this.deviceRepository.save(assignment.device);
    }

    assignment.active = false;
    assignment.endDate = assignment.endDate ?? new Date();
assignment.active = false;
assignment.endDate = assignment.endDate ?? new Date();

await this.deviceHistoryRepository.save({
  device: assignment.device,
  employee: assignment.employee,
  action: 'RELEASED',
  notes: 'Asignación eliminada',
});

return this.assignmentRepository.save(assignment);
  }
  
}
