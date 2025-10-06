import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';

@Module({
  controllers: [OptionsController],
  providers: [OptionsService],
  imports: [TypeOrmModule.forFeature([Option])],
})
export class OptionsModule {}
