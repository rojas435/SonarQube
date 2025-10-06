import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { FragranceService } from './fragrance.service';
import { CreateFragranceDto } from './dto/create-fragrance.dto';
import { UpdateFragranceDto } from './dto/update-fragrance.dto';
import { searchDto } from 'src/candles/container/dto/search-container.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('fragrance')
@UseGuards(JwtAuthGuard)
export class FragranceController {
  constructor(private readonly fragranceService: FragranceService) {}

  @Get()
  @Public()
  getAllFragrance(@Query() params: searchDto) {
    return this.fragranceService.getAll();
  }

  @Get(':id')
  @Public()
  getFragranceById(@Param('id', ParseUUIDPipe) id: string) {
    return this.fragranceService.findById(id);
  }

  @Post('')
  @Roles('admin')
  create(@Body() createFragrance: CreateFragranceDto) {
    return this.fragranceService.create(createFragrance);
  }


  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFragrance: UpdateFragranceDto) {
    return this.fragranceService.update(id, updateFragrance);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.fragranceService.delete(id);
  }
}
