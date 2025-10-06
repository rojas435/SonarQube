import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateFragranceDto } from './dto/create-fragrance.dto';
import { UpdateFragranceDto } from './dto/update-fragrance.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Fragrance } from './entities/fragrance.entity';

@Injectable()
export class FragranceService {
  constructor(@InjectRepository(Fragrance) private fragranceRepository: Repository<Fragrance>) {}

  async create(Fragrance: CreateFragranceDto) {
    try {
      return await this.fragranceRepository.save(Fragrance);
    } catch (error) {
      if (error.code === '23502') {
        throw new BadRequestException(`Null value in column "${error.column}" violates not-null constraint`);
      } else if( error.message.includes('duplicate key value violates unique constraint')) {
        throw new ConflictException(`Fragrance with name ${Fragrance.name} already exists`);
      } else if (error.message.includes('value too long for type character varying(255)')) {
        throw new BadRequestException(`Value too long for type character varying(255)`);
      }

      throw new BadRequestException(`Error creating fragrance: ${error.message}`);
    }
  }

  getAll(): Promise<Fragrance[]> {
    return this.fragranceRepository.find();
  }

  async findById(id: string): Promise<Fragrance> {
    const fragrance = await this.fragranceRepository.findOneBy({ id });
    if(fragrance == null) throw new NotFoundException(`Fragrance with id ${id} not found`);

    return fragrance;
  }

  async update(id: string, updateFragrance: UpdateFragranceDto): Promise<Fragrance> {
    const result = await this.fragranceRepository.update(id, updateFragrance);
    if(result.affected && result.affected < 1) throw new NotFoundException(`Fragrance with id ${id} not found`);
    return this.findById(id);
  }

  delete(id: string): Promise<Fragrance> {
    const deleteFragrance = this.findById(id);
    this.fragranceRepository.delete(id);
    if(deleteFragrance == null) throw new NotFoundException(`Fragrance with id ${id} not found`);
    return deleteFragrance;
  }
}
