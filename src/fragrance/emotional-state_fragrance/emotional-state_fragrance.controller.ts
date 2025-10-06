import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { EmotionalStateFragranceService } from './emotional-state_fragrance.service';
import { CreateEmotionalStateFragranceDto } from './dto/create-emotional-state_fragrance.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard'; 
import { Public } from 'src/decorators/public.decorator';

@Controller('emotional-state-fragrance')
@UseGuards(JwtAuthGuard)
export class EmotionalStateFragranceController {
  constructor(private readonly emotionalStateFragranceService: EmotionalStateFragranceService) {}

  // @Post('')
  // @Roles('admin')
  // create(@Body() createEmotionalStateFragranceDto: CreateEmotionalStateFragranceDto) {
  //   return this.emotionalStateFragranceService.create(createEmotionalStateFragranceDto);
  // }

  // @Get()
  // @Public()
  // findAll() {
  //   return this.emotionalStateFragranceService.findAll();
  // }

  // @Get('by-emotional-state/:id')
  // @Public()
  // findByEmotionalState(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.emotionalStateFragranceService.findByEmotionalState(id);
  // }

  // @Get(':emotionalStateId/:fragranceId')
  // @Public()
  // findOne(@Param('emotionalStateId') emotionalStateId: string, @Param('fragranceId') fragranceId: string) {
  //   return this.emotionalStateFragranceService.findByEmotionalStateAndFragranceId(emotionalStateId, fragranceId);
  // }

  

  @Get(':emotionalStateId')
  @Public()
  findByEmotionalStateId(@Param('emotionalStateId') emotionalStateId: string) {
    return this.emotionalStateFragranceService.findByEmotionalStateId(emotionalStateId);
  }

  @Get(':fragranceId')
  @Public()
  findByFragranceId(@Param('fragranceId') fragranceId: string) {
    return this.emotionalStateFragranceService.findByFragranceId(fragranceId);
  }

  // @Delete(':emotionalStateId/:fragranceId')
  // @Roles('admin')
  // remove(@Param('emotionalStateId') emotionalStateId: string, @Param('fragranceId') fragranceId: string) {
  //   return this.emotionalStateFragranceService.delete(emotionalStateId, fragranceId);
  // }

}
