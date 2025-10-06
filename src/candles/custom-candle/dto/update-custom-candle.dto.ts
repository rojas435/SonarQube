import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber, IsUUID, IsIn, IsUrl, Min } from 'class-validator';

@InputType()
export class UpdateCustomCandleDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  containerId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID()
  fragranceId?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

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