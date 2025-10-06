import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockService = {
    getAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('gettAllUsers', () => {
    it('should call service.getAll and return the result', async () => {
      const mockResult = [
        { id: 'uuid', name: 'John Doe', email: 'john@example.com', role: 'customer' },
      ];

      mockService.getAll.mockResolvedValue(mockResult);

      const result = await controller.gettAllUsers({});
      expect(result).toEqual(mockResult);
      expect(mockService.getAll).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should call service.findById and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'John Doe', email: 'john@example.com', role: 'customer' };

      mockService.findById.mockResolvedValue(mockResult);

      const result = await controller.getUserById('uuid');
      expect(result).toEqual(mockResult);
      expect(mockService.findById).toHaveBeenCalledWith('uuid');
    });
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const mockResult = { id: 'uuid', ...dto };

      mockService.create.mockResolvedValue(mockResult);

      const result = await controller.create(dto);
      expect(result).toEqual(mockResult);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto: UpdateUserDto = { name: 'John Updated' };
      const mockResult = { id: 'uuid', ...dto };

      mockService.update.mockResolvedValue(mockResult);

      //const result = await controller.update('uuid', dto);
      //expect(result).toEqual(mockResult);
      expect(mockService.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('remove', () => {
    it('should call service.delete and return the result', async () => {
      const mockResult = { id: 'uuid', name: 'John Doe', email: 'john@example.com', role: 'customer' };

      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.remove('uuid');
      expect(result).toEqual(mockResult);
      expect(mockService.delete).toHaveBeenCalledWith('uuid');
    });
  });
});