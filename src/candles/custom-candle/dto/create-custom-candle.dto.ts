import { IsString, IsOptional, IsNumber, IsUUID, IsIn, IsUrl, Min } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateCustomCandleDto {
  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @Field(() => String)
  @IsUUID()
  containerId: string;

  @Field(() => String)
  @IsUUID()
  fragranceId: string;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  customImageUrl?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsIn(['pending', 'completed', 'cancelled'])
  status?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  qrCodeUrl?: string;
}