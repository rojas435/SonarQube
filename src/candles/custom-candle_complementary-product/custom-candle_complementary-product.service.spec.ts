import { Test, TestingModule } from '@nestjs/testing';
import { CustomCandleComplementaryProductService } from './custom-candle_complementary-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomCandleComplementaryProduct } from './entities/custom-candle_complementary-product.entity';
import { CustomCandle } from '../custom-candle/entities/custom-candle.entity';
import { ComplementaryProduct } from '../complementary-product/entities/complementary-product.entity';
import { NotFoundException } from '@nestjs/common';

describe('CustomCandleComplementaryProductService', () => {
  let service: CustomCandleComplementaryProductService;
  let repository: jest.Mocked<Repository<CustomCandleComplementaryProduct>>;
  let customCandleRepository: jest.Mocked<Repository<CustomCandle>>;
  let complementaryProductRepository: jest.Mocked<Repository<ComplementaryProduct>>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockCustomCandleRepository = {
    findOne: jest.fn(),
  };

  const mockComplementaryProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomCandleComplementaryProductService,
        {
          provide: getRepositoryToken(CustomCandleComplementaryProduct),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(CustomCandle),
          useValue: mockCustomCandleRepository,
        },
        {
          provide: getRepositoryToken(ComplementaryProduct),
          useValue: mockComplementaryProductRepository,
        },
      ],
    }).compile();

    service = module.get<CustomCandleComplementaryProductService>(CustomCandleComplementaryProductService);
    repository = module.get(getRepositoryToken(CustomCandleComplementaryProduct));
    customCandleRepository = module.get(getRepositoryToken(CustomCandle));
    complementaryProductRepository = module.get(getRepositoryToken(ComplementaryProduct));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if CustomCandle does not exist', async () => {
      const createDto = { customCandleId: 'uuid-candle', complementaryProductId: 1 };

      customCandleRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow('CustomCandle with id uuid-candle not found');
      expect(customCandleRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-candle' } });
    });

    it('should throw an error if ComplementaryProduct does not exist', async () => {
      const createDto = { customCandleId: 'uuid-candle', complementaryProductId: 1 };
      const mockCustomCandle = { id: 'uuid-candle' } as CustomCandle;

      customCandleRepository.findOne.mockResolvedValue(mockCustomCandle);
      complementaryProductRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow('ComplementaryProduct with id 1 not found');
      expect(complementaryProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should create a CustomCandleComplementaryProduct successfully', async () => {
      const createDto = { customCandleId: 'uuid-candle', complementaryProductId: 1 };
      const mockCustomCandle = { id: 'uuid-candle' } as CustomCandle;
      const mockComplementaryProduct = { id: 1 } as ComplementaryProduct;
      const mockEntity = {
        id: 1,
        customCandle: mockCustomCandle,
        complementaryProduct: mockComplementaryProduct,
      } as CustomCandleComplementaryProduct;

      customCandleRepository.findOne.mockResolvedValue(mockCustomCandle);
      complementaryProductRepository.findOne.mockResolvedValue(mockComplementaryProduct);
      repository.create.mockReturnValue(mockEntity);
      repository.save.mockResolvedValue(mockEntity);

      const result = await service.create(createDto);

      expect(result).toEqual(mockEntity);
      expect(repository.create).toHaveBeenCalledWith({
        customCandle: mockCustomCandle,
        complementaryProduct: mockComplementaryProduct,
      });
      expect(repository.save).toHaveBeenCalledWith(mockEntity);
    });
  });

  describe('remove', () => {
    it('should remove a CustomCandleComplementaryProduct', async () => {
      const mockEntity = {
        id: 1,
        customCandle: { id: 'uuid-candle' } as CustomCandle,
        complementaryProduct: { id: 1 } as ComplementaryProduct,
      } as CustomCandleComplementaryProduct;

      repository.findOne.mockResolvedValue(mockEntity);
      repository.remove.mockResolvedValue(mockEntity);

      const result = await service.remove(1);

      expect(result).toEqual(mockEntity);
      expect(repository.remove).toHaveBeenCalledWith(mockEntity);
    });

    it('should throw an error if CustomCandleComplementaryProduct to remove is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow('CustomCandleComplementaryProduct with id 1 not found');
    });
  });
});