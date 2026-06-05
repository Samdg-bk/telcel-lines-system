import { Controller, Post, Body } from '@nestjs/common';
import { IaService } from './ia.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  @Post('chat')
  async chat(@Body() dto: ChatDto) {
    return this.iaService.chat(dto.message);
  }
}