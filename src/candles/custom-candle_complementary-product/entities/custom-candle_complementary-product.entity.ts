import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { CustomCandle } from "src/candles/custom-candle/entities/custom-candle.entity";
import { ComplementaryProduct } from "src/candles/complementary-product/entities/complementary-product.entity";
import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class CustomCandleComplementaryProduct {
    @Field(() => Int)
    @PrimaryGeneratedColumn('increment') 
    id: number;

    @Field(() => CustomCandle)
    @ManyToOne(() => CustomCandle, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'custom_candle_id' })
    customCandle: CustomCandle;

    @Field(() => ComplementaryProduct)
    @ManyToOne(() => ComplementaryProduct, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'complementary_product_id' })
    complementaryProduct: ComplementaryProduct;
}