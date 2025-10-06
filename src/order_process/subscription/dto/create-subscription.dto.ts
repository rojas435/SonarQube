import { Type } from 'class-transformer';
import { IsUUID, IsDate, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  userId: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsString()
  status: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  renewalDate?: Date;

  @IsString()
  @IsOptional()
  plan?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número válido con hasta 2 decimales' })
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}