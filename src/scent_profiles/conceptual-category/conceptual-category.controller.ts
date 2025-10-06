import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ConceptualCategoryService } from './conceptual-category.service';
import { CreateConceptualCategoryDto } from './dto/create-conceptual-category.dto';
import { UpdateConceptualCategoryDto } from './dto/update-conceptual-category.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('conceptual-category')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConceptualCategoryController {
  constructor(private readonly conceptualCategoryService: ConceptualCategoryService) {}

  @Post()
  @Roles('admin')
  create(@Body() createConceptualCategoryDto: CreateConceptualCategoryDto) {
    return this.conceptualCategoryService.create(createConceptualCategoryDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.conceptualCategoryService.findAll();
  }

  @Get(':id')
  @Public()
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.conceptualCategoryService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConceptualCategoryDto: UpdateConceptualCategoryDto,
  ) {
    return this.conceptualCategoryService.update(id, updateConceptualCategoryDto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.conceptualCategoryService.delete(id);
  }
}
