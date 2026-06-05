import { IsString, IsUUID } from 'class-validator';

export class CreatePhoneLineDto {

  @IsString()
  phoneNumber: string;

  @IsString()
  accountNumber: string;

  @IsString()
  plan: string;

  @IsUUID()
  companyId: string;

}