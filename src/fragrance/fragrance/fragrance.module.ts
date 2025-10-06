import { Module } from '@nestjs/common';
import { FragranceService } from './fragrance.service';
import { FragranceController } from './fragrance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fragrance } from './entities/fragrance.entity';
import { FragranceResolver } from './fragrance.resolver';

@Module({
  controllers: [FragranceController],
  providers: [FragranceService, FragranceResolver],
  imports: [TypeOrmModule.forFeature([Fragrance])],
})
export class FragranceModule {}
