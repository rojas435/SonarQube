import { Controller, Get, Post, Body, Patch, Param, Delete, ParseArrayPipe, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @Roles('admin')
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.create(createSubscriptionDto);
  }

  @Get()
  @Public()
  getAllSubscriptions() {
    return this.subscriptionService.getAll();
  }

  @Get(':id')
  @Public()
  findBySubscriptionId(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.subscriptionService.delete(id);
  }
}
