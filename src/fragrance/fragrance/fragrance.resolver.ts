import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FragranceService } from './fragrance.service';
import { Fragrance } from './entities/fragrance.entity';
import { CreateFragranceDto } from './dto/create-fragrance.dto';
import { UpdateFragranceDto } from './dto/update-fragrance.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

@Resolver(() => Fragrance)
@UseGuards(GqlAuthGuard, RolesGuard)
export class FragranceResolver {
  constructor(private readonly fragranceService: FragranceService) {}

  @Query(() => [Fragrance], { name: 'fragrances' })
  @Roles('admin', 'customer', 'supervisor')
  getAllFragrance() {
    console.log('GraphQL: getAllFragrance called');
    return this.fragranceService.getAll();
  }

  @Query(() => Fragrance, { name: 'fragrance' })
  @Roles('admin', 'customer', 'supervisor')
  getFragranceById(@Args('id', { type: () => String }) id: string) {
    console.log('GraphQL: getFragranceById called with id:', id);
    return this.fragranceService.findById(id);
  }

  @Mutation(() => Fragrance)
  @Roles('admin')
  createFragrance(@Args('createFragranceDto') createFragranceDto: CreateFragranceDto) {
    console.log('GraphQL: createFragrance called with:', createFragranceDto);
    return this.fragranceService.create(createFragranceDto);
  }

  @Mutation(() => Fragrance)
  @Roles('admin')
  updateFragrance(
    @Args('id', { type: () => String }) id: string,
    @Args('updateFragranceDto') updateFragranceDto: UpdateFragranceDto
  ) {
    console.log('GraphQL: updateFragrance called with id:', id, 'and:', updateFragranceDto);
    return this.fragranceService.update(id, updateFragranceDto);
  }

  @Mutation(() => Boolean)
  @Roles('admin')
  async deleteFragrance(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    console.log('GraphQL: deleteFragrance called with id:', id);
    await this.fragranceService.delete(id);
    return true;
  }
}