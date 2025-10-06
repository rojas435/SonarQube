import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Container } from './entities/container.entity';

@Injectable()
export class ContainerService {
  constructor(@InjectRepository(Container) private containerRepository: Repository<Container>) {}
  


  async create(Container: CreateContainerDto) {
    let newContainer = await this.containerRepository.save(Container);
    return newContainer;
  }

  getAll(): Promise<Container[]> {
    return this.containerRepository.find();
  }

  async findById(id: string): Promise<Container> {
    const container = await this.containerRepository.findOneBy({ id });
    if(container == null) throw new NotFoundException(`Container with id ${id} not found`);

    return container;
  }

  async update(id: string, updateContainer: UpdateContainerDto): Promise<Container> {
    const result = await this.containerRepository.update(id, updateContainer);
    if (!result.affected) {
      throw new NotFoundException(`Container with id ${id} not found`);
    }
    return this.findById(id);
  }

  delete(id: string): Promise<Container> {
    const deleteContainer = this.findById(id);
    this.containerRepository.delete(id);
    if(deleteContainer == null) throw new NotFoundException(`Container with id ${id} not found`);
    return deleteContainer;
  }
}
