import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Fragrance {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    name: string;

    // Relaciones comentadas, agregar @Field si se usan en GraphQL
}