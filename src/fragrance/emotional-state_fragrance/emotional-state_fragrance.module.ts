import { Module } from '@nestjs/common';
import { EmotionalStateFragranceService } from './emotional-state_fragrance.service';
import { EmotionalStateFragranceController } from './emotional-state_fragrance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmotionalStateFragrance } from './entities/emotional-state_fragrance.entity';

@Module({
  controllers: [EmotionalStateFragranceController],
  providers: [EmotionalStateFragranceService],
  imports: [TypeOrmModule.forFeature([EmotionalStateFragrance])]

})
export class EmotionalStateFragranceModule {}
