import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomCandleComplementaryProductDto } from './dto/create-custom-candle_complementary-product.dto';
import { UpdateCustomCandleComplementaryProductDto } from './dto/update-custom-candle_complementary-product.dto';
import { CustomCandleComplementaryProduct } from './entities/custom-candle_complementary-product.entity';
import { CustomCandle } from '../custom-candle/entities/custom-candle.entity';
import { ComplementaryProduct } from '../complementary-product/entities/complementary-product.entity';

@Injectable()
export class CustomCandleComplementaryProductService {
  constructor(
    @InjectRepository(CustomCandleComplementaryProduct)
    private readonly repository: Repository<CustomCandleComplementaryProduct>,
    @InjectRepository(CustomCandle)
    private readonly customCandleRepository: Repository<CustomCandle>,
    @InjectRepository(ComplementaryProduct)
    private readonly complementaryProductRepository: Repository<ComplementaryProduct>,
  ) {}

  async create(createDto: CreateCustomCandleComplementaryProductDto) {
    const { customCandleId, complementaryProductId } = createDto;

    // Verificar si CustomCandle existe (UUID)
    const customCandle = await this.customCandleRepository.findOne({ where: { id: customCandleId } });
    if (!customCandle) {
      throw new NotFoundException(`CustomCandle with id ${customCandleId} not found`);
    }

    // Verificar si ComplementaryProduct existe (integer)
    const complementaryProduct = await this.complementaryProductRepository.findOne({ where: { id: complementaryProductId } });
    if (!complementaryProduct) {
      throw new NotFoundException(`ComplementaryProduct with id ${complementaryProductId} not found`);
    }

    // Crear la relación
    const entity = this.repository.create({
      customCandle,
      complementaryProduct,
    });

    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find({
      relations: ['customCandle', 'complementaryProduct'],
    });
  }

  async findOne(id: number) {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['customCandle', 'complementaryProduct'],
    });

    if (!entity) {
      throw new NotFoundException(`CustomCandleComplementaryProduct with id ${id} not found`);
    }

    return entity;
  }

  async findByCustomCandleId(customCandleId: string) {
    const customCandle = await this.customCandleRepository.findOne({ where: { id: customCandleId } });
    if (!customCandle) {
      throw new NotFoundException(`CustomCandle with id ${customCandleId} not found`);
    }
    const relations = await this.repository.find({
      where: { customCandle: { id: customCandleId } },
      relations: ['complementaryProduct'],
    });
    // Solo retorna el id de la relación y el id del producto complementario
    return relations.map(rel => ({
      id: rel.id,
      complementaryProductId: rel.complementaryProduct.id,
    }));
  }

  async update(id: number, updateDto: UpdateCustomCandleComplementaryProductDto) {
    const entity = await this.repository.findOne({ where: { id }, relations: ['customCandle', 'complementaryProduct'] });
    if (!entity) {
      throw new NotFoundException(`CustomCandleComplementaryProduct with id ${id} not found`);
    }
    if (updateDto.customCandleId) {
      const customCandle = await this.customCandleRepository.findOne({ where: { id: updateDto.customCandleId } });
      if (!customCandle) {
        throw new NotFoundException(`CustomCandle with id ${updateDto.customCandleId} not found`);
      }
      entity.customCandle = customCandle;
    }
    if (updateDto.complementaryProductId) {
      const complementaryProduct = await this.complementaryProductRepository.findOne({ where: { id: updateDto.complementaryProductId } });
      if (!complementaryProduct) {
        throw new NotFoundException(`ComplementaryProduct with id ${updateDto.complementaryProductId} not found`);
      }
      entity.complementaryProduct = complementaryProduct;
    }
    return this.repository.save(entity);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    return this.repository.remove(entity);
  }
}