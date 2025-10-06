import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UseGuards, Injectable } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/roles.decorator';

@Injectable()
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  async getUsers() {
    return this.userService.getAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  async getUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  async updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
    @Context() ctx
  ) {
    const user = ctx.req.user;
    if (user.role !== 'admin' && user.id !== id) {
      throw new Error('No tienes permisos para modificar este usuario');
    }
    return this.userService.update(id, updateUserDto);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteUser(@Args('id', { type: () => String }) id: string) {
    await this.userService.delete(id);
    return true;
  }
}