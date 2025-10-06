import 'reflect-metadata';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CustomCandleService } from './custom-candle.service';
import { CustomCandle } from './entities/custom-candle.entity';
import { CreateCustomCandleDto } from './dto/create-custom-candle.dto';
import { UpdateCustomCandleDto } from './dto/update-custom-candle.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver(() => CustomCandle)
@UseGuards(GqlAuthGuard, RolesGuard)
export class CustomCandleResolver {
  constructor(private readonly customCandleService: CustomCandleService) {}

  @Query(() => [CustomCandle], { name: 'customCandles' })
  @Roles('admin', 'customer', 'supervisor')
  findAll() {
    return this.customCandleService.findAll();
  }

  @Query(() => CustomCandle, { name: 'customCandle' })
  @Roles('admin', 'customer', 'supervisor')
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.customCandleService.findOne(id);
  }

  @Query(() => [CustomCandle], { name: 'customCandlesByUser' })
  @Roles('admin', 'customer', 'supervisor')
  findByUser(@Args('userId', { type: () => String }) userId: string) {
    return this.customCandleService.findByUserId(userId);
  }

  @Mutation(() => CustomCandle)
  @Roles('admin', 'customer', 'supervisor')
  createCustomCandle(
    @Args('createCustomCandleDto') createCustomCandleDto: CreateCustomCandleDto
  ) {
    return this.customCandleService.create(createCustomCandleDto);
  }

  @Mutation(() => CustomCandle)
  @Roles('admin', 'customer', 'supervisor')
  updateCustomCandle(
    @Args('id', { type: () => String }) id: string,
    @Args('updateCustomCandleDto') updateCustomCandleDto: UpdateCustomCandleDto
  ) {
    return this.customCandleService.update(id, updateCustomCandleDto);
  }

  @Mutation(() => CustomCandle)
  @Roles('admin', 'customer', 'supervisor')
  removeCustomCandle(@Args('id', { type: () => String }) id: string) {
    return this.customCandleService.remove(id);
  }
}