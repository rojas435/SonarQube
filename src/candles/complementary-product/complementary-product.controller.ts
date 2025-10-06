import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComplementaryProductService } from './complementary-product.service';
import { CreateComplementaryProductDto } from './dto/create-complementary-product.dto';
import { UpdateComplementaryProductDto } from './dto/update-complementary-product.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard'; 
import { Public } from 'src/decorators/public.decorator';

@Controller('complementary-product')
@UseGuards(JwtAuthGuard)
export class ComplementaryProductController {
  constructor(private readonly complementaryProductService: ComplementaryProductService) {}

  @Post()
  @Roles('admin')
  create(@Body() createComplementaryProductDto: CreateComplementaryProductDto) {
    return this.complementaryProductService.create(createComplementaryProductDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.complementaryProductService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: number) {
    return this.complementaryProductService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: number, @Body() updateComplementaryProductDto: UpdateComplementaryProductDto) {
    return this.complementaryProductService.update(id, updateComplementaryProductDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: number) {
    return this.complementaryProductService.remove(id);
  }
}