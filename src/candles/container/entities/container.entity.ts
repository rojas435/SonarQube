import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class Container {
    @Field(() => String)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true, type: 'varchar', length: 255 })
    image_url: string;
}