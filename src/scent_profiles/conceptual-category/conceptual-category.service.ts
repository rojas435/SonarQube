import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConceptualCategory } from './entities/conceptual-category.entity';
import { CreateConceptualCategoryDto } from './dto/create-conceptual-category.dto';
import { UpdateConceptualCategoryDto } from './dto/update-conceptual-category.dto';

@Injectable()
export class ConceptualCategoryService {
  constructor(
    @InjectRepository(ConceptualCategory)
    private conceptualCategoryRepository: Repository<ConceptualCategory>,
  ) {}

  async create(dto: CreateConceptualCategoryDto): Promise<ConceptualCategory> {
    try {
      return await this.conceptualCategoryRepository.save(dto);
    } catch (error) {
      if (error.code === '23502') {
        throw new BadRequestException(
          `Null value in column "${error.column}" violates not-null constraint`,
        );
      }
      if (error.message.includes('duplicate key value')) {
        throw new ConflictException(
          `ConceptualCategory with name ${dto.name} already exists`,
        );
      }
      if (error.message.includes('value too long')) {
        throw new BadRequestException('Value too long for type character varying(255)');
      }
      throw new BadRequestException(`Error creating conceptual category: ${error.message}`);
    }
  }

  findAll(): Promise<ConceptualCategory[]> {
    return this.conceptualCategoryRepository.find();
  }

  async findById(id: string): Promise<ConceptualCategory> {
    const category = await this.conceptualCategoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(`ConceptualCategory with id ${id} not found`);
    return category;
  }

  async update(id: string, updateConceptualCategoryDto: UpdateConceptualCategoryDto): Promise<ConceptualCategory> {
    const result = await this.conceptualCategoryRepository.update(id, updateConceptualCategoryDto);
    if (result.affected === 0) throw new NotFoundException(`ConceptualCategory with id ${id} not found`);
    return this.findById(id);
  }

  async delete(id: string): Promise<ConceptualCategory> {
    const category = await this.findById(id);
    if (!category) throw new NotFoundException(`ConceptualCategory with id ${id} not found`);
    await this.conceptualCategoryRepository.delete(id);
    return category;
  }
}