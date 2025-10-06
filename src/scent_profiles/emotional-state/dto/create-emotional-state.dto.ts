import { IsString, IsUUID, Length } from "class-validator";

export class CreateEmotionalStateDto {
    @IsString({ message: 'El nombre es necesario' })
    @Length(1, 255, { message: 'El nombre debe tener entre 1 y 255 caracteres' })
    readonly name: string;

    @IsString({ message: 'La descripción es necesaria' })
    @Length(1, 255, { message: 'La descripción debe tener entre 1 y 255 caracteres' })
    readonly description: string;

    @IsUUID('4', { message: 'El ID de la opción debe ser un UUID válido' })
    readonly optionId: string;
}