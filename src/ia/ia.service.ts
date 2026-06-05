import { Injectable } from '@nestjs/common';
import ollama from 'ollama';
import { EmployeesService } from '../employees/employees.service';
import { DevicesService } from '../devices/devices.service';
import { PhoneLinesService } from '../phone-lines/phone-lines.service';
import { FacturasService } from '../facturas/facturas.service';


@Injectable()
export class IaService {


  constructor(
    private readonly employeesService: EmployeesService,
    private readonly devicesService: DevicesService,
    private readonly phoneLinesService: PhoneLinesService,
    private readonly facturasService: FacturasService,
  ) {}

async chat(message: string) {

  const pregunta = message.toLowerCase();

 if (pregunta.includes('empleado')) {

  const total =
    (await this.employeesService.findAll()).length;

  const response = await ollama.chat({
    model: 'llama3',
    messages: [
      {
        role: 'system',
        content: `
        Eres un asistente empresarial.
        Hay ${total} empleados registrados.
        Responde de forma profesional y breve.
        `,
      },
      {
        role: 'user',
        content: message,
      },
    ],
  });

  return {
    response: response.message.content,
  };
}

  if (pregunta.includes('equipo') ||
    pregunta.includes('dispositivo')) {

  const total =
    (await this.devicesService.findAll()).length;

  return {
    response: `Actualmente existen ${total} dispositivos registrados.`,
  };
}

if (pregunta.includes('linea')) {

  const total =
    (await this.phoneLinesService.findAll()).length;

  return {
    response: `Actualmente existen ${total} líneas registradas.`,
  };
}

if (pregunta.includes('factura')) {

  const total =
    (await this.facturasService.findAll()).length;

  return {
    response: `Actualmente existen ${total} facturas registradas.`,
  };
}

  return {
    response: 'No entendí la consulta.',
  };

}
}