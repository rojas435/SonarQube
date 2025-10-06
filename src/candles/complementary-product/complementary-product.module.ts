import { Module } from '@nestjs/common';
import { ComplementaryProductService } from './complementary-product.service';
import { ComplementaryProductController } from './complementary-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplementaryProduct } from './entities/complementary-product.entity';
import { ComplementaryProductResolver } from './complementary-product.resolver';

@Module({
  controllers: [ComplementaryProductController],
  providers: [ComplementaryProductService, ComplementaryProductResolver],
  imports: [TypeOrmModule.forFeature([ComplementaryProduct])],
})
export class ComplementaryProductModule {}