import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { EmotionalStateService } from './emotional-state.service';
import { CreateEmotionalStateDto } from './dto/create-emotional-state.dto';
import { UpdateEmotionalStateDto } from './dto/update-emotional-state.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('emotional-state')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmotionalStateController {
  constructor(private readonly emotionalStateService: EmotionalStateService) {}

  @Post()
  @Roles('admin')
  create(@Body() createEmotionalStateDto: CreateEmotionalStateDto) {
    return this.emotionalStateService.create(createEmotionalStateDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.emotionalStateService.findAll();
  }

  @Get(':id')
  @Public()
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.emotionalStateService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEmotionalStateDto: UpdateEmotionalStateDto) {
    return this.emotionalStateService.update(id, updateEmotionalStateDto);
  }

  @Get('by-option/:id')
  @Public()
  findByOption(@Param('id', ParseUUIDPipe) id: string) {
    return this.emotionalStateService.findByOption(id);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.emotionalStateService.delete(id);
  }
}