import 'reflect-metadata';
import { InputType, Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserDto {

  @Field(() => String, { nullable: true })
  @ApiProperty({ example: 'Juan Perez', description: 'Nombre del usuario' })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({ example: 'JuanP@example.com', description: 'Correo del usuario' })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({ example: 'admin, supervisor', description: 'Rol con el cual va tener acceso a ciertas rutas' })
  @IsOptional()
  @IsString()
  role?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  currentPassword?: string;
}