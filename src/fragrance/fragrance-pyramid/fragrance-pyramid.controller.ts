import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FragrancePyramidService } from './fragrance-pyramid.service';
import { CreateFragrancePyramidDto } from './dto/create-fragrance-pyramid.dto';
import { UpdateFragrancePyramidDto } from './dto/update-fragrance-pyramid.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('fragrance-pyramid')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FragrancePyramidController {
  constructor(private readonly fragrancePyramidService: FragrancePyramidService) {}

  // @Post()
  // @Roles('admin')
  // create(@Body() createFragrancePyramidDto: CreateFragrancePyramidDto) {
  //   return this.fragrancePyramidService.create(createFragrancePyramidDto);
  // }

  @Get()
  @Public()
  getAllFragrancePyramids() {
    return this.fragrancePyramidService.getAll();
  }

  @Get(':id')
  @Public()
  findByFragrancePyramidId(@Param('id') id: string) {
    return this.fragrancePyramidService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateFragrancePyramidDto: UpdateFragrancePyramidDto) {
    return this.fragrancePyramidService.update(id, updateFragrancePyramidDto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.fragrancePyramidService.delete(id);
  }
}
