import { Module } from '@nestjs/common';
import { PasswordService } from './password.utils'; // Asegúrate de que la ruta sea correcta

@Module({
  providers: [PasswordService],
  exports: [PasswordService], // Exporta el servicio
})
export class UtilsModule {}