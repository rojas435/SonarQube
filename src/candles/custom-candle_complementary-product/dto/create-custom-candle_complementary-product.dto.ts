import { IsUUID, IsNumber } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateCustomCandleComplementaryProductDto {
  @Field(() => String)
  @IsUUID()
  customCandleId: string; // UUID para CustomCandle

  @Field(() => Int)
  @IsNumber()
  complementaryProductId: number; // Integer para ComplementaryProduct
}