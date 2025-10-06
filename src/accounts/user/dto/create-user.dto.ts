import 'reflect-metadata';
import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

@InputType()
export class CreateUserDto {
    @Field(() => String)
    @ApiProperty({ example: 'Juan Perez', description: 'Nombre del usuario' })
    @IsString({message: 'El nombre es necesario'})
    readonly name: string;

    @Field(() => String)
    @ApiProperty({ example: 'JuanP@example.com', description: 'Correo del usuario' })
    @IsString({message: 'El correo de usuario es necesario'})
    readonly email: string;
    

    @Field(() => String)
    @IsString({message: 'La contraseña es necesaria'})
    @Length(5, 20, {message: 'La contraseña debe tener entre 5 y 20 caracteres'})
    readonly password: string;
}
