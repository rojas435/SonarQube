import { Module } from '@nestjs/common';
import { EmotionalStateService } from './emotional-state.service';
import { EmotionalStateController } from './emotional-state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmotionalState } from './entities/emotional-state.entity';

@Module({
  controllers: [EmotionalStateController],
  providers: [EmotionalStateService],
  imports: [TypeOrmModule.forFeature([EmotionalState])],
})
export class EmotionalStateModule {}
