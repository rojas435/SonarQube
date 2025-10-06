import { Module } from '@nestjs/common';
import { FragrancePyramidService } from './fragrance-pyramid.service';
import { FragrancePyramidController } from './fragrance-pyramid.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FragrancePyramid } from './entities/fragrance-pyramid.entity';

@Module({
  controllers: [FragrancePyramidController],
  providers: [FragrancePyramidService],
  imports: [TypeOrmModule.forFeature([FragrancePyramid])],
})
export class FragrancePyramidModule {}
