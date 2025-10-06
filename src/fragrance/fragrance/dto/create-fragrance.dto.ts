import { IsString } from "class-validator";
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFragranceDto {

  @Field(() => String)
  @IsString({ message: 'El nombre de la fragancia es necesario' })
  readonly name: string;

}