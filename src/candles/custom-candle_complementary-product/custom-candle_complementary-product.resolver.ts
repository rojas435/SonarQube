import 'reflect-metadata';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CustomCandleComplementaryProductService } from './custom-candle_complementary-product.service';
import { CustomCandleComplementaryProduct } from './entities/custom-candle_complementary-product.entity';
import { CreateCustomCandleComplementaryProductDto } from './dto/create-custom-candle_complementary-product.dto';
import { UpdateCustomCandleComplementaryProductDto } from './dto/update-custom-candle_complementary-product.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';


@Resolver(() => CustomCandleComplementaryProduct)
@UseGuards(GqlAuthGuard, RolesGuard)
export class CustomCandleComplementaryProductResolver {
  constructor(private readonly service: CustomCandleComplementaryProductService) {}

  @Query(() => [CustomCandleComplementaryProduct], { name: 'customCandleComplementaryProducts' })
  @Roles('admin', 'customer', 'supervisor')
  findAll() {
    return this.service.findAll();
  }

  @Query(() => CustomCandleComplementaryProduct, { name: 'customCandleComplementaryProduct' })
  @Roles('admin', 'customer', 'supervisor')
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Query(() => [CustomCandleComplementaryProduct], { name: 'customCandleComplementaryProductsByCustomCandle' })
  @Roles('admin', 'customer', 'supervisor')
  findByCustomCandle(@Args('customCandleId', { type: () => String }) customCandleId: string) {
    return this.service.findByCustomCandleId(customCandleId);
  }

  @Mutation(() => CustomCandleComplementaryProduct)
  @Roles('admin', 'customer', 'supervisor')
  createCustomCandleComplementaryProduct(
    @Args('createCustomCandleComplementaryProductDto') createDto: CreateCustomCandleComplementaryProductDto
  ) {
    return this.service.create(createDto);
  }

  @Mutation(() => CustomCandleComplementaryProduct)
  @Roles('admin', 'customer', 'supervisor')
  updateCustomCandleComplementaryProduct(
    @Args('updateCustomCandleComplementaryProductDto') updateDto: UpdateCustomCandleComplementaryProductDto
  ) {
    return this.service.update(updateDto.id, updateDto);
  }

  @Mutation(() => Boolean)
  @Roles('admin', 'customer', 'supervisor')
  async removeCustomCandleComplementaryProduct(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.service.remove(id);
    return true;
  }
}