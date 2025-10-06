import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ContainerService } from './container.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { searchDto } from './dto/search-container.dto';
import { Roles } from 'src/guards/roles.decorator';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard'; 
import { Public } from 'src/decorators/public.decorator';

@Controller('container')
@UseGuards(JwtAuthGuard)
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Get()
  @Public()
  getAllContainers(@Query() params: searchDto) {
    return this.containerService.getAll();
  }

  @Get(':id')
  @Public()
  getContainerById(@Param('id', ParseUUIDPipe)id: string) {
    return this.containerService.findById(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() createContainer: CreateContainerDto) {
    return this.containerService.create(createContainer);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateContainer: UpdateContainerDto) {
    return this.containerService.update(id, updateContainer);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.containerService.delete(id);
  }
}
