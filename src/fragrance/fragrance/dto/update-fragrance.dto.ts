import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateFragranceDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'El nombre de la fragancia es necesario' })
  readonly name?: string;
}