import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CustomCandle } from './entities/custom-candle.entity';
import { CreateCustomCandleDto } from './dto/create-custom-candle.dto';
import { UpdateCustomCandleDto } from './dto/update-custom-candle.dto';
import { Container } from '../container/entities/container.entity';
import { Fragrance } from 'src/fragrance/fragrance/entities/fragrance.entity';
// import { EmotionalState } from 'src/scent_profiles/emotional-state/entities/emotional-state.entity';
import { User } from 'src/accounts/user/entities/user.entity'; // Importar la entidad User
import {GoogleGenAI} from '@google/genai';
import { response } from 'express';
import * as QRCode from 'qrcode';

@Injectable()
export class CustomCandleService {
  
  constructor(
    @InjectRepository(CustomCandle)
    private readonly customCandleRepository: Repository<CustomCandle>,
    @InjectRepository(Container)
    private readonly containerRepository: Repository<Container>,
    @InjectRepository(Fragrance)
    private readonly fragranceRepository: Repository<Fragrance>,
    // @InjectRepository(EmotionalState)
    // private readonly emotionalStateRepository: Repository<EmotionalState>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 

  ) {}

  async create(createCustomCandleDto: CreateCustomCandleDto) {
    const { containerId, fragranceId, userId, ...candleData } = createCustomCandleDto;
  
    // Buscar el objeto Container
    const container = await this.containerRepository.findOne({ where: { id: containerId } });
    if (!container) {
      throw new NotFoundException(`Container with id ${containerId} not found`);
    }
  
    // Buscar el objeto Fragrance
    const fragrance = await this.fragranceRepository.findOne({ where: { id: fragranceId } });
    if (!fragrance) {
      throw new NotFoundException(`Fragrance with id ${fragranceId} not found`);
    }
  
    // // Buscar el objeto EmotionalState
    // const emotionalState = await this.emotionalStateRepository.findOne({ where: { id: emotionalStateId } });
    // if (!emotionalState) {
    //   throw new NotFoundException(`EmotionalState with id ${emotionalStateId} not found`);
    // }
  
    // Buscar el objeto User (si se proporciona userId)
    const user = userId
      ? await this.userRepository.findOne({ where: { id: userId } })
      : undefined;
    if (userId && !user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  
    // Crear la vela personalizada con los objetos relacionados
    const customCandle = this.customCandleRepository.create({
      ...candleData,
      container: container as DeepPartial<Container>, // Asegurar que sea del tipo DeepPartial
      fragrance: fragrance as DeepPartial<Fragrance>, // Asegurar que sea del tipo DeepPartial
      // emotionalState: emotionalState as DeepPartial<EmotionalState>, // Asegurar que sea del tipo DeepPartial
      user: user as DeepPartial<User> | undefined, // Asegurar que sea del tipo DeepPartial o undefined
    });
  
    return this.customCandleRepository.save(customCandle);
  }

  findAll() {
    return this.customCandleRepository.find({ relations: ['user', 'container', 'fragrance'] });
  }

  async findOne(id: string) {
    const customCandle = await this.customCandleRepository.findOne({
      where: { id },
      relations: ['user', 'container', 'fragrance'],
    });
    if (!customCandle) {
      throw new NotFoundException(`CustomCandle with id ${id} not found`);
    }
    return customCandle;
  }

  async findByUserId(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return this.customCandleRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'container', 'fragrance'],
    });
  }

  async update(id: string, updateCustomCandleDto: UpdateCustomCandleDto) {
    const { containerId, fragranceId, ...candleData } = updateCustomCandleDto;

    const customCandle = await this.findOne(id);
    if (!customCandle) {
      throw new NotFoundException(`CustomCandle with id ${id} not found`);
    }

    // Actualizar relaciones si se proporcionan
    if (containerId) {
      const container = await this.containerRepository.findOne({ where: { id: containerId } });
      if (!container) {
        throw new NotFoundException(`Container with id ${containerId} not found`);
      }
      customCandle.container = container;
    }

    if (fragranceId) {
      const fragrance = await this.fragranceRepository.findOne({ where: { id: fragranceId } });
      if (!fragrance) {
        throw new NotFoundException(`Fragrance with id ${fragranceId} not found`);
      }
      customCandle.fragrance = fragrance;
    }

    // if (emotionalStateId) {
    //   const emotionalState = await this.emotionalStateRepository.findOne({ where: { id: emotionalStateId } });
    //   if (!emotionalState) {
    //     throw new NotFoundException(`EmotionalState with id ${emotionalStateId} not found`);
    //   }
    //   customCandle.emotionalState = emotionalState;
    // }

    // Actualizar los demás campos
    Object.assign(customCandle, candleData);

    return this.customCandleRepository.save(customCandle);
  }

  async remove(id: string) {
    const customCandle = await this.findOne(id); // Reutiliza el método findOne para validar
    await this.customCandleRepository.remove(customCandle);
    return customCandle;
  }

  async beautifyText(promptText: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = "Genera un mensaje corto y emotivo para una categoría elegida aleatoriamente entre Amor, Celebración, Alegría y Felicitación. El mensaje debe estar en una sola línea, no superar las 20 letras, tener un tono cercano y auténtico, usar lenguaje poético pero sencillo, y ser poderoso para dejar huella y hacer sonreír. La salida debe ser estrictamente en el formato: Categoría: Mensaje. Proporciona solo el mensaje, sin explicaciones ni contexto adicional, ni introducción de ningún tipo.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [{ text: prompt }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return text;
  }

  async generateQRCode(url: string): Promise<string> {
    try {
      const qrCodeImage = await QRCode.toDataURL(url, { type: 'image/png' });
      return qrCodeImage;
    } catch (error) {
      throw new Error('Error generating QR code: ' + error.message);
    }
  }


}