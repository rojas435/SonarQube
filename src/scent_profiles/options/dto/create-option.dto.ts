import { IsString, IsUUID, Length } from "class-validator";

export class CreateOptionDto {
    @IsString({ message: 'El nombre es necesario' })
    @Length(1, 255, { message: 'El nombre debe tener entre 1 y 255 caracteres' })
    readonly name: string;

    @IsUUID('4', { message: 'El ID de la categoría conceptual debe ser un UUID válido' })
    readonly conceptualCategoryId: string;
}