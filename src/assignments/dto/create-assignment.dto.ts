export class CreateAssignmentDto {
  employeeId: string;

  phoneLineId: string;

  deviceId: string;

  startDate?: Date;

  endDate?: Date;

  active?: boolean;
}
