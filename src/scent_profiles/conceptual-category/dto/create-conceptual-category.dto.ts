import { IsString, Length, IsOptional } from "class-validator";

export class CreateConceptualCategoryDto {
    @IsString({ message: 'El nombre es necesario' })
    @Length(1, 255, { message: 'El nombre debe tener entre 1 y 255 caracteres' })
    readonly name: string;
}