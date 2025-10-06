import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  // Nuevo endpoint para verificar la conexión con el frontend
  @Get('api/health-check')
  @Public()
  healthCheck() {
    return { message: 'Backend is running' };
  }
}