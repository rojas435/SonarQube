import { IsString, IsUUID, Length } from "class-validator";

export class CreateEmotionalStateFragranceDto {

    @IsUUID('4', { message: 'El ID de la fragancia debe ser un UUID válido' })
    readonly fragranceId: string;

    @IsUUID('4', { message: 'El ID del estado emocional debe ser un UUID válido' })
    readonly emotionalStateId: string;
}
