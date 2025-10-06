import { IsString, Length } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateContainerDto {
    @Field(() => String)
    @IsString({message: 'El nombre es necesario' })
    readonly name: string;

    @Field(() => String)
    @IsString({message: 'La imagen es necesaria' })
    @Length(1, 255, { message: 'La imagen es necesaria' })
    readonly image_url: string;
}