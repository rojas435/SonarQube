import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ComplementaryProduct {
    @Field(() => Int)
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Field(() => String)
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ type: 'text', nullable: true })
    description: string;

    @Field(() => String, { nullable: true })
    @Column({ type: 'text', nullable: true })
    image_url: string;

    @Field(() => Float, { nullable: true })
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    price: number;
}