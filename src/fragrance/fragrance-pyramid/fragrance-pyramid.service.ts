import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFragrancePyramidDto } from './dto/create-fragrance-pyramid.dto';
import { UpdateFragrancePyramidDto } from './dto/update-fragrance-pyramid.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { FragrancePyramid } from './entities/fragrance-pyramid.entity';

@Injectable()
export class FragrancePyramidService {
  constructor(@InjectRepository(FragrancePyramid) private fragrancePyramidRepository: Repository<FragrancePyramid>) {}

  // async create(fragrancePyramid: CreateFragrancePyramidDto) {
  //   const { fragranceId, ...fragrancePyramidData } = fragrancePyramid;

  //   // Fetch the Fragrance entity using the provided ID
  //   const fragrance = await this.fragrancePyramidRepository.manager.findOne('Fragrance', { where: { id: fragranceId } });
  //   if (!fragrance) {
  //     throw new NotFoundException(`Fragrance with id ${fragranceId} not found`);
  //   }

  //   // Create the FragrancePyramid entity and assign the Fragrance
  //   const newFragrancePyramid = this.fragrancePyramidRepository.create({
  //     ...fragrancePyramidData,
  //     fragrance,
  //   });

  //   return this.fragrancePyramidRepository.save(newFragrancePyramid);
  // }

  getAll(): Promise<FragrancePyramid[]> {
    return this.fragrancePyramidRepository.find();
  }

  async findById(id: string): Promise<FragrancePyramid> {
    const fragrancePyramid = await this.fragrancePyramidRepository.findOneBy({ id });
    if(fragrancePyramid == null) throw new NotFoundException(`FragrancePyramid with id ${id} not found`);

    return fragrancePyramid;
  }

  async update(id: string, updateFragrancePyramid: UpdateFragrancePyramidDto): Promise<FragrancePyramid> {
    const result = await this.fragrancePyramidRepository.update(id, updateFragrancePyramid);
    if(result.affected && result.affected < 1) throw new NotFoundException(`FragrancePyramid with id ${id} not found`);
    return this.findById(id);
  }

  delete(id: string): Promise<FragrancePyramid> {
    const deleteFragrancePyramid = this.findById(id);
    this.fragrancePyramidRepository.delete(id);
    if(deleteFragrancePyramid == null) throw new NotFoundException(`FragrancePyramid with id ${id} not found`);
    return deleteFragrancePyramid;
  }
}
