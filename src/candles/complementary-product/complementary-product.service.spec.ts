import { Test, TestingModule } from '@nestjs/testing';
import { ComplementaryProductService } from './complementary-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplementaryProduct } from './entities/complementary-product.entity';

describe('ComplementaryProductService', () => {
  let service: ComplementaryProductService;
  let repository: Repository<ComplementaryProduct>;

  // Mock del repositorio
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplementaryProductService,
        {
          provide: getRepositoryToken(ComplementaryProduct),
          useValue: mockRepository, // Simulación del repositorio
        },
      ],
    }).compile();

    service = module.get<ComplementaryProductService>(ComplementaryProductService);
    repository = module.get<Repository<ComplementaryProduct>>(getRepositoryToken(ComplementaryProduct));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new complementary product', async () => {
      const createDto = { name: 'New Product', price: 10.5};
      const mockProduct = { id: 1, ...createDto };

      mockRepository.create.mockReturnValue(mockProduct);
      mockRepository.save.mockResolvedValue(mockProduct);

      const result = await service.create(createDto);

      expect(result).toEqual(mockProduct);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw an error if save fails', async () => {
      const createDto = { name: 'New Product', price: 10.5};

      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.create(createDto)).rejects.toThrow('Save failed');
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all complementary products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 10.5},
        { id: 2, name: 'Product 2', price: 20.0},
      ];

      mockRepository.find.mockResolvedValue(mockProducts);

      const result = await service.findAll();

      expect(result).toEqual(mockProducts);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if find fails', async () => {
      mockRepository.find.mockRejectedValue(new Error('Find failed'));

      await expect(service.findAll()).rejects.toThrow('Find failed');
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a complementary product by ID', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 10.5};

      mockRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(result).toEqual(mockProduct);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if product is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow('ComplementaryProduct with id 1 not found');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if findOne fails', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('FindOne failed'));

      await expect(service.findOne(1)).rejects.toThrow('FindOne failed');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update a complementary product', async () => {
      const updateDto = { name: 'Updated Product', price: 15.0};
      const mockProduct = { id: 1, name: 'Old Product', price: 10.5};

      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue({ ...mockProduct, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(result).toEqual({ id: 1, ...updateDto });
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw an error if product to update is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated Product' })).rejects.toThrow(
        'ComplementaryProduct with id 1 not found',
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if update fails', async () => {
      const updateDto = { name: 'Updated Product', price: 15.0};

      mockRepository.findOne.mockResolvedValue({ id: 1 });
      mockRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.update(1, updateDto)).rejects.toThrow('Update failed');
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a complementary product', async () => {
      const mockProduct = { id: 1, name: 'Product to Delete', price: 10.5};

      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.remove.mockResolvedValue(mockProduct);

      const result = await service.remove(1);

      expect(result).toEqual(mockProduct);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw an error if product to remove is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow('ComplementaryProduct with id 1 not found');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if remove fails', async () => {
      const mockProduct = { id: 1, name: 'Product to Delete', price: 10.5};

      mockRepository.findOne.mockResolvedValue(mockProduct);
      mockRepository.remove.mockRejectedValue(new Error('Remove failed'));

      await expect(service.remove(1)).rejects.toThrow('Remove failed');
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProduct);
    });
  });
});