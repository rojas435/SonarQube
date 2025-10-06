import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
    @Field(() => String)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    email: string;

    @Field(() => String)
    @Column({ type: 'text', nullable: false })
    password: string;

    @Field(() => String, { nullable: true })
    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Field(() => Date)
    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Field(() => String)
    @Column({ default: 'customer' })
    role: string;
}
