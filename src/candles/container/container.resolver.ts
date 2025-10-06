import 'reflect-metadata';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContainerService } from './container.service';
import { Container } from './entities/container.entity';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver(() => Container)
@UseGuards(GqlAuthGuard, RolesGuard)
export class ContainerResolver {
  constructor(private readonly containerService: ContainerService) {}

  @Query(() => [Container], { name: 'containers' })
  @Roles('admin', 'customer', 'supervisor')
  getAllContainers() {
    return this.containerService.getAll();
  }

  @Query(() => Container, { name: 'container' })
  @Roles('admin', 'customer', 'supervisor')
  getContainerById(@Args('id', { type: () => String }) id: string) {
    return this.containerService.findById(id);
  }

  @Mutation(() => Container)
  @Roles('admin')
  createContainer(@Args('createContainerDto') createContainerDto: CreateContainerDto) {
    return this.containerService.create(createContainerDto);
  }

  @Mutation(() => Container)
  @Roles('admin')
  updateContainer(
    @Args('id', { type: () => String }) id: string,
    @Args('updateContainerDto') updateContainerDto: UpdateContainerDto
  ) {
    return this.containerService.update(id, updateContainerDto);
  }

  @Mutation(() => Boolean)
  @Roles('admin')
  async deleteContainer(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    await this.containerService.delete(id);
    return true;
  }
}