import { PartialType } from '@nestjs/mapped-types';
import { CreateFragrancePyramidDto } from './create-fragrance-pyramid.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFragrancePyramidDto extends PartialType(CreateFragrancePyramidDto) {
    @IsOptional()
    @IsString({ message: 'La nota de salida debe ser una cadena de texto' })
    readonly top?: string; 

    @IsOptional()
    @IsString({ message: 'La nota de corazón debe ser una cadena de texto' })
    readonly heart?: string;

    @IsOptional()
    @IsString({ message: 'La nota de fondo debe ser una cadena de texto' })
    readonly base?: string;
}
