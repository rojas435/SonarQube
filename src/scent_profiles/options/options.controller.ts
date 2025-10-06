import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('options')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  @Roles('admin')
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.optionsService.findAll();
  }

  @Get(':id')
  @Public()
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.optionsService.findById(id);
  }

  @Get('by-conceptual-category/:id')
  @Public()
  findByConceptualCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.optionsService.findByConceptualCategory(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionsService.update(id, updateOptionDto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.optionsService.delete(id);
  }
}