import { Test, TestingModule } from '@nestjs/testing';
import { ComplementaryProductController } from './complementary-product.controller';
import { ComplementaryProductService } from './complementary-product.service';

describe('ComplementaryProductController', () => {
  let controller: ComplementaryProductController;
  let service: ComplementaryProductService;

  // Mock del servicio
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplementaryProductController],
      providers: [
        {
          provide: ComplementaryProductService,
          useValue: mockService, // Simulación del servicio
        },
      ],
    }).compile();

    controller = module.get<ComplementaryProductController>(ComplementaryProductController);
    service = module.get<ComplementaryProductService>(ComplementaryProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created product', async () => {
      const createDto = { name: 'New Product', price: 10.5};
      const mockProduct = { id: 1, ...createDto };

      mockService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockProduct);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw an error if service.create fails', async () => {
      const createDto = { name: 'New Product', price: 10.5};

      mockService.create.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(createDto)).rejects.toThrow('Service error');
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return all products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 10.5},
        { id: 2, name: 'Product 2', price: 20.0},
      ];

      mockService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(result).toEqual(mockProducts);
      expect(mockService.findAll).toHaveBeenCalled();
    });

    it('should throw an error if service.findAll fails', async () => {
      mockService.findAll.mockRejectedValue(new Error('Service error'));

      await expect(controller.findAll()).rejects.toThrow('Service error');
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return the product', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 10.5};

      mockService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockProduct);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if product is not found', async () => {
      mockService.findOne.mockRejectedValue(new Error('Product not found'));

      await expect(controller.findOne(1)).rejects.toThrow('Product not found');
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call service.update and return the updated product', async () => {
      const updateDto = { name: 'Updated Product', price: 15.0};
      const mockProduct = { id: 1, ...updateDto };

      mockService.update.mockResolvedValue(mockProduct);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockProduct);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw an error if service.update fails', async () => {
      const updateDto = { name: 'Updated Product', price: 15.0};

      mockService.update.mockRejectedValue(new Error('Service error'));

      await expect(controller.update(1, updateDto)).rejects.toThrow('Service error');
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return the removed product', async () => {
      const mockProduct = { id: 1, name: 'Product to Delete', price: 10.5};

      mockService.remove.mockResolvedValue(mockProduct);

      const result = await controller.remove(1);

      expect(result).toEqual(mockProduct);
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an error if service.remove fails', async () => {
      mockService.remove.mockRejectedValue(new Error('Service error'));

      await expect(controller.remove(1)).rejects.toThrow('Service error');
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });
  });
});