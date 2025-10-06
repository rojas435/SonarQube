import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmotionalStateFragrance } from './entities/emotional-state_fragrance.entity';
import { CreateEmotionalStateFragranceDto } from './dto/create-emotional-state_fragrance.dto';



@Injectable()
export class EmotionalStateFragranceService {

  constructor(
    @InjectRepository(EmotionalStateFragrance)
    private emotionalStateFragranceRepository: Repository<EmotionalStateFragrance>,
  ) {}

  // async create(createEmotionalStateFragranceDto: CreateEmotionalStateFragranceDto): Promise<EmotionalStateFragrance> {
  //   const { fragranceId, emotionalStateId, ...emotionalStateFragranceData } = createEmotionalStateFragranceDto;

  //   // Fetch the Fragrance and EmotionalState entities using the provided IDs
  //   const fragrance = await this.emotionalStateFragranceRepository.manager.findOne('Fragrance', { where: { id: fragranceId } });
  //   if (!fragrance) {
  //     throw new NotFoundException(`Fragrance with id ${fragranceId} not found`);
  //   }

  //   // Fetch the EmotionalState entity using the provided ID
  //   const emotionalState = await this.emotionalStateFragranceRepository.manager.findOne('EmotionalState', { where: { id: emotionalStateId } });
  //   if (!emotionalState) {
  //     throw new NotFoundException(`EmotionalState with id ${emotionalStateId} not found`);
  //   }

  //   // Create the EmotionalStateFragrance entity and assign the Fragrance and EmotionalState
  //   const newEmotionalStateFragrance = this.emotionalStateFragranceRepository.create({
  //     ...emotionalStateFragranceData,
  //     fragrance,
  //     emotionalState,
  //   });

  //   return this.emotionalStateFragranceRepository.save(newEmotionalStateFragrance);
  // }

  // findAll() {
  //   return this.emotionalStateFragranceRepository.find({ relations: ['fragrance', 'emotionalState'] });
  // }

  async findByEmotionalStateId(id: string): Promise<EmotionalStateFragrance> {
    const emotionalStateFragrance = await this.emotionalStateFragranceRepository.findOne({ where: { id }, relations: ['fragrance', 'emotionalState'] });
    if (!emotionalStateFragrance) throw new NotFoundException(`EmotionalStateFragrance with id ${id} not found`);
    return emotionalStateFragrance;
  }

  async findByFragranceId(id: string): Promise<EmotionalStateFragrance> {
    const emotionalStateFragrance = await this.emotionalStateFragranceRepository.findOne({ where: { id }, relations: ['fragrance', 'emotionalState'] });
    if (!emotionalStateFragrance) throw new NotFoundException(`EmotionalStateFragrance with id ${id} not found`);
    return emotionalStateFragrance;
  }

  // async findByEmotionalStateAndFragranceId(emotionalStateId: string, fragranceId: string): Promise<EmotionalStateFragrance> {
  //   const emotionalStateFragrance = await this.emotionalStateFragranceRepository.findOne({ 
  //     where: { 
  //       emotionalState: { id: emotionalStateId }, 
  //       fragrance: { id: fragranceId } 
  //     }, 
  //     relations: ['fragrance', 'emotionalState'] // Asegúrate de incluir las relaciones aquí
  //   });
  //   if (!emotionalStateFragrance) throw new NotFoundException(`EmotionalStateFragrance with emotionalStateId ${emotionalStateId} and fragranceId ${fragranceId} not found`);
  //   return emotionalStateFragrance;
  // }


  // //find fragrances by emotional state
  // async findByEmotionalState(id: string): Promise<any[]> {
  //   const emotionalStateFragrance = await this.emotionalStateFragranceRepository.find({
  //     where: { emotionalState: { id } },
  //     relations: ['fragrance'],
  //   });
  //   if (emotionalStateFragrance.length === 0) {
  //     throw new NotFoundException(`No emotional state fragrances found for emotional state with id ${id}`);
  //   }
  //   // Return only the fragrance objects
  //   return emotionalStateFragrance.map(esf => esf.fragrance);
  // }

  // async delete(emotionalStateId: string, fragranceId: string): Promise<EmotionalStateFragrance> {
  //   const emotionalStateFragrance = await this.findByEmotionalStateAndFragranceId(emotionalStateId, fragranceId);
  //   await this.emotionalStateFragranceRepository.delete({ emotionalState: { id: emotionalStateId }, fragrance: { id: fragranceId } });
  //   return emotionalStateFragrance;
  // }

}
