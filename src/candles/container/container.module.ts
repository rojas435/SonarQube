import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerController } from './container.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Container } from './entities/container.entity';
import { ContainerResolver } from './container.resolver';


@Module({
  controllers: [ContainerController],
  providers: [ContainerService, ContainerResolver],
  imports: [TypeOrmModule.forFeature([Container])

],
})
export class ContainerModule {}
