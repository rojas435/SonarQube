import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Container } from "../../container/entities/container.entity";
import { Fragrance } from "src/fragrance/fragrance/entities/fragrance.entity";
import { User } from "src/accounts/user/entities/user.entity";

@ObjectType()
@Entity()
export class CustomCandle {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Field(() => Container)
  @ManyToOne(() => Container)
  @JoinColumn({ name: 'container_id' })
  container: Container;

  @Field(() => Fragrance)
  @ManyToOne(() => Fragrance)
  @JoinColumn({ name: 'fragrance_id' })
  fragrance: Fragrance;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  customImageUrl?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  notes?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  qrCodeUrl?: string;
}