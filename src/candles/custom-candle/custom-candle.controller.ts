import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomCandleService } from './custom-candle.service';
import { CreateCustomCandleDto } from './dto/create-custom-candle.dto';
import { UpdateCustomCandleDto } from './dto/update-custom-candle.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard'; 
import { Public } from 'src/decorators/public.decorator';


@Controller('custom-candle')
@UseGuards(JwtAuthGuard)
export class CustomCandleController {
  constructor(private readonly customCandleService: CustomCandleService) {}

  @Post()
  @Public()
  create(@Body() createCustomCandleDto: CreateCustomCandleDto) {
    return this.customCandleService.create(createCustomCandleDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.customCandleService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.customCandleService.findOne(id);
  }

  @Get('by-user/:userId')
  @Public()
  findByUser(@Param('userId') userId: string) {
    return this.customCandleService.findByUserId(userId);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateCustomCandleDto: UpdateCustomCandleDto) {
    return this.customCandleService.update(id, updateCustomCandleDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.customCandleService.remove(id);
  }

  @Post('beautify')
  @Public()
  async beautifyText(@Body('text') text: string) {
    const result = await this.customCandleService.beautifyText(text);
    return { text: result }; 
  }

  @Post('generate-qr')
  @Public()
  async generateQRCode(@Body('text') text: string) {
    if (!text || typeof text !== 'string') {
      throw new Error('The "text" field is required and must be a string.');
    }
    const qrCodeImage = await this.customCandleService.generateQRCode(text);
    return { qrCodeImage }; 
  }
}