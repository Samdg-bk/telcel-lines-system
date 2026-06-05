export class CreateDeviceDto {
  brand: string;

  model: string;

  imei: string;

  serialNumber?: string;

  companyId?: string;

  status?: string;

  notes?: string;
}
