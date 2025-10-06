import { IsUUID, IsNumber, IsOptional, IsString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '../../order-item/dto/create-order-item.dto';

export class CreateOrderDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El total debe ser un número válido con hasta 2 decimales' })
  @Min(0, { message: 'El total no puede ser negativo' })
  totalAmount: number;

  @IsString()
  status?: string;

  @IsString()
  shippingAddress?: string;

  @IsString()
  city?: string;

  @IsString()
  postalCode?: string;

  @IsString()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}