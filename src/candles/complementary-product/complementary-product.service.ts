import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplementaryProduct } from './entities/complementary-product.entity';
import { CreateComplementaryProductDto } from './dto/create-complementary-product.dto';
import { UpdateComplementaryProductDto } from './dto/update-complementary-product.dto';

@Injectable()
export class ComplementaryProductService {
  constructor(
    @InjectRepository(ComplementaryProduct)
    private readonly complementaryProductRepository: Repository<ComplementaryProduct>,
  ) {}

  create(createComplementaryProductDto: CreateComplementaryProductDto) {
    const product = this.complementaryProductRepository.create(createComplementaryProductDto);
    return this.complementaryProductRepository.save(product);
  }

  findAll() {
    return this.complementaryProductRepository.find();
  }

  async findOne(id: number) {
    const product = await this.complementaryProductRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`ComplementaryProduct with id ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateComplementaryProductDto: UpdateComplementaryProductDto) {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error(`ComplementaryProduct with id ${id} not found`);
    }
    await this.complementaryProductRepository.update(id, updateComplementaryProductDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.findOne(id); // Reutiliza findOne para verificar si existe
    return this.complementaryProductRepository.remove(product);
  }
}