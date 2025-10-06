import 'reflect-metadata';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ComplementaryProductService } from './complementary-product.service';
import { ComplementaryProduct } from './entities/complementary-product.entity';
import { CreateComplementaryProductDto } from './dto/create-complementary-product.dto';
import { UpdateComplementaryProductDto } from './dto/update-complementary-product.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver(() => ComplementaryProduct)
@UseGuards(GqlAuthGuard, RolesGuard)
export class ComplementaryProductResolver {
  constructor(private readonly complementaryProductService: ComplementaryProductService) {}

  @Query(() => [ComplementaryProduct], { name: 'complementaryProducts' })
  @Roles('admin', 'customer', 'supervisor')
  findAll() {
    return this.complementaryProductService.findAll();
  }

  @Query(() => ComplementaryProduct, { name: 'complementaryProduct' })
  @Roles('admin', 'customer', 'supervisor')
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.complementaryProductService.findOne(id);
  }

  @Mutation(() => ComplementaryProduct)
  @Roles('admin')
  createComplementaryProduct(
    @Args('createComplementaryProductDto') createComplementaryProductDto: CreateComplementaryProductDto
  ) {
    return this.complementaryProductService.create(createComplementaryProductDto);
  }

  @Mutation(() => ComplementaryProduct)
  @Roles('admin')
  updateComplementaryProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateComplementaryProductDto') updateComplementaryProductDto: UpdateComplementaryProductDto
  ) {
    return this.complementaryProductService.update(id, updateComplementaryProductDto);
  }

  @Mutation(() => Boolean)
  @Roles('admin')
  async removeComplementaryProduct(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.complementaryProductService.remove(id);
    return true;
  }
}