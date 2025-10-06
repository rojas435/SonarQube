import { IsUUID, IsInt, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  customCandleId?: string;

  @IsInt()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El subtotal debe ser un número válido con hasta 2 decimales' })
  subtotal: number;
}