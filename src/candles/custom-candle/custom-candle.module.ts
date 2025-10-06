import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomCandleService } from './custom-candle.service';
import { CustomCandleController } from './custom-candle.controller';
import { CustomCandle } from './entities/custom-candle.entity';
import { Container } from '../container/entities/container.entity';
import { Fragrance } from 'src/fragrance/fragrance/entities/fragrance.entity';
// import { EmotionalState } from 'src/scent_profiles/emotional-state/entities/emotional-state.entity';
import { User } from 'src/accounts/user/entities/user.entity';
import { CustomCandleResolver } from './custom-candle.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomCandle, Container, Fragrance, User]),
  ],
  controllers: [CustomCandleController],
  providers: [CustomCandleService, CustomCandleResolver],
})
export class CustomCandleModule {}