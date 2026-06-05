import { PartialType } from '@nestjs/mapped-types';
import { ChatDto } from './chat.dto';

export class UpdateIaDto extends PartialType(ChatDto) {}
