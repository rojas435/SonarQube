import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entities/option.entity';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionsRepository: Repository<Option>,
  ) {}

  async create(createOptionDto: CreateOptionDto): Promise<Option> {
    const { conceptualCategoryId, ...optionData } = createOptionDto;
  
    const conceptualCategory = await this.optionsRepository.manager.findOne('ConceptualCategory', { where: { id: conceptualCategoryId } });
    if (!conceptualCategory) {
      throw new NotFoundException(`ConceptualCategory with id ${conceptualCategoryId} not found`);
    }
  
    const newOption = this.optionsRepository.create({
      ...optionData,
      conceptualCategory,
    });
  
    try {
      return await this.optionsRepository.save(newOption);
    } catch (error) {
      if (error.code === '23502') {
        throw new BadRequestException(`Null value in column "${error.column}" violates not-null constraint`);
      }
      if (error.message.includes('duplicate key value')) {
        throw new ConflictException(`Option with name ${createOptionDto.name} already exists`);
      }
      if (error.message.includes('value too long')) {
        throw new BadRequestException('Value too long for type character varying(255)');
      }
      throw new BadRequestException(`Error creating option: ${error.message}`);
    }
  }

  findAll(): Promise<Option[]> {
    return this.optionsRepository.find({ relations: ['conceptualCategory'] });
  }

  async findById(id: string): Promise<Option> {
    const option = await this.optionsRepository.findOne({ where: { id }, relations: ['conceptualCategory'] });
    if (!option) throw new NotFoundException(`Option with id ${id} not found`);
    return option;
  }

  async findByConceptualCategory(id: string): Promise<Option[]> {
    const options = await this.optionsRepository.find({ where: { conceptualCategory: { id } }, relations: ['conceptualCategory'] });
    if (options.length === 0) throw new NotFoundException(`No options found for conceptual category with id ${id}`);
    return options;
  }

  async update(id: string, updateOptionDto: UpdateOptionDto): Promise<Option> {
    const result = await this.optionsRepository.update(id, updateOptionDto);
    if (result.affected === 0) throw new NotFoundException(`Option with id ${id} not found`);
    return this.findById(id);
  }

  async delete(id: string): Promise<Option> {
    const option = await this.findById(id);
    await this.optionsRepository.delete(id);
    return option;
  }
}