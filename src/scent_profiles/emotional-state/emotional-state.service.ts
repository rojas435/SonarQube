import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmotionalState } from './entities/emotional-state.entity';
import { CreateEmotionalStateDto } from './dto/create-emotional-state.dto';
import { UpdateEmotionalStateDto } from './dto/update-emotional-state.dto';

@Injectable()
export class EmotionalStateService {
  constructor(
    @InjectRepository(EmotionalState)
    private emotionalStateRepository: Repository<EmotionalState>,
  ) {}

  async create(createEmotionalStateDto: CreateEmotionalStateDto): Promise<EmotionalState> {
    const { optionId, ...emotionalStateData } = createEmotionalStateDto;
      
    // Fetch the Option entity using the provided ID
    const option = await this.emotionalStateRepository.manager.findOne('Option', { where: { id: optionId } });
    if (!option) {
      throw new NotFoundException(`Option with id ${optionId} not found`);
    }

    // Create the EmotionalState entity and assign the Option
    const newEmotionalState = this.emotionalStateRepository.create({
      ...emotionalStateData,
      option,
    });

    return this.emotionalStateRepository.save(newEmotionalState);
  }

  findAll(): Promise<EmotionalState[]> {
    return this.emotionalStateRepository.find({ relations: ['option'] });
  }

  async findById(id: string): Promise<EmotionalState> {
    const state = await this.emotionalStateRepository.findOne({ where: { id }, relations: ['option'] });
    if (!state) throw new NotFoundException(`EmotionalState with id ${id} not found`);
    return state;
  }

  async findByOption(id: string): Promise<EmotionalState[]> {
    const states = await this.emotionalStateRepository.find({ where: { option: { id } }, relations: ['option'] });
    if (states.length === 0) throw new NotFoundException(`No emotional states found for option with id ${id}`);
    return states;
  }

  async update(id: string, updateEmotionalStateDto: UpdateEmotionalStateDto): Promise<EmotionalState> {
    const result = await this.emotionalStateRepository.update(id, updateEmotionalStateDto);
    if (result.affected === 0) throw new NotFoundException(`EmotionalState with id ${id} not found`);
    return this.findById(id);
  }

  async delete(id: string): Promise<EmotionalState> {
    const state = await this.findById(id);
    await this.emotionalStateRepository.delete(id);
    return state;
  }
}