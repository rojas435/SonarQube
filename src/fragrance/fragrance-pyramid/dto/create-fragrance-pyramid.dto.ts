import { IsString, IsUUID, Length } from "class-validator";

export class CreateFragrancePyramidDto {
    @IsUUID('4', { message: 'El ID de la fragancia debe ser un UUID válido' })
    readonly fragranceId: string;

   @IsString({ message: 'La nota de salida debe ser una cadena de texto' })
   @Length(1, 50, { message: 'La nota de salida debe tener entre 1 y 50 caracteres' })
   readonly top: string;

   @IsString({ message: 'La nota de corazón debe ser una cadena de texto' })
   @Length(1, 50, { message: 'La nota de corazón debe tener entre 1 y 50 caracteres' })
   readonly heart: string;

   @IsString({ message: 'La nota de fondo debe ser una cadena de texto' })
   @Length(1, 50, { message: 'La nota de fondo debe tener entre 1 y 50 caracteres' })
   readonly base: string;

}
