import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomCandleComplementaryProductService } from './custom-candle_complementary-product.service';
import { CustomCandleComplementaryProductController } from './custom-candle_complementary-product.controller';
import { CustomCandleComplementaryProduct } from './entities/custom-candle_complementary-product.entity';
import { CustomCandle } from '../custom-candle/entities/custom-candle.entity';
import { ComplementaryProduct } from '../complementary-product/entities/complementary-product.entity';
import { CustomCandleComplementaryProductResolver } from './custom-candle_complementary-product.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomCandleComplementaryProduct, CustomCandle, ComplementaryProduct]),
  ],
  controllers: [CustomCandleComplementaryProductController],
  providers: [CustomCandleComplementaryProductService, CustomCandleComplementaryProductResolver],
})
export class CustomCandleComplementaryProductModule {}