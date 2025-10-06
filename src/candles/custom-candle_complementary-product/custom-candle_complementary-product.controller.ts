import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomCandleComplementaryProductService } from './custom-candle_complementary-product.service';
import { CreateCustomCandleComplementaryProductDto } from './dto/create-custom-candle_complementary-product.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard'; 
import { Public } from 'src/decorators/public.decorator';

@Controller('custom-candle-complementary-product')
@UseGuards(JwtAuthGuard)
export class CustomCandleComplementaryProductController {
  constructor(private readonly service: CustomCandleComplementaryProductService) {}

  @Post()
  @Roles('admin, customer, supervisor')
  create(@Body() createDto: CreateCustomCandleComplementaryProductDto) {
    return this.service.create(createDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Get('by-custom-candle/:customCandleId')
  @Public()
  findByCustomCandle(@Param('customCandleId') customCandleId: string) {
    return this.service.findByCustomCandleId(customCandleId);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}