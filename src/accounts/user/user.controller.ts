import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { searchUserDto } from './dto/search-user.dto'; 
import { Roles } from '../../guards/roles.decorator'; 
import { RolesGuard } from '../../guards/roles.guard'; 
import { Public } from '../../decorators/public.decorator'; 
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('user')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  @Public() 
  gettAllUsers(@Query() params: searchUserDto) {
    return this.userService.getAll();
  }

  @Get(':id')
  @Public() 
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }

  @Post()
  @Public()
  create(@Body() createUser: CreateUserDto) {
    return this.userService.create(createUser);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUser: UpdateUserDto,
    @Req() req: Request
  ) {
    // El usuario autenticado está en req.user (gracias a JwtStrategy)
    const user: any = req.user;
    // Si el usuario no es admin, solo puede modificar su propio usuario
    if (user.role !== 'admin' && user.id !== id) {
      throw new ForbiddenException('No tienes permisos para modificar este usuario');
    }
    return this.userService.update(id, updateUser);
  }

  @Delete(':id')
  @Roles('admin') // Solo usuarios con rol 'admin' pueden acceder
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
  
}