import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordService } from 'src/utils/password.utils';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let passwordService: PasswordService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPasswordService = {
    hashPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash the password and save the user', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';
      const newUser = { ...dto, password: hashedPassword };
      const savedUser = { id: 'uuid', ...newUser };

      mockPasswordService.hashPassword.mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(newUser);
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(dto);

      expect(passwordService.hashPassword).toHaveBeenCalledWith(dto.password);
      expect(repository.create).toHaveBeenCalledWith(newUser);
      expect(repository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(savedUser);
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 'uuid', name: 'John Doe', email: 'john@example.com' }];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.getAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const user = { id: 'uuid', name: 'John Doe', email: 'john@example.com' };
      mockRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findById('uuid');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid' });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findById('uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 'uuid', name: 'John Doe', email: 'john@example.com' };
      mockRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findByEmail('john@example.com');

      expect(repository.findOneBy).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(result).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findByEmail('john@example.com')).rejects.toThrow(
        'User with email john@example.com not found',
      );
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const dto = { name: 'Updated Name' };
      const user = { id: 'uuid', name: 'John Doe', email: 'john@example.com' };
      const updatedUser = { ...user, ...dto };

      mockRepository.findOneBy.mockResolvedValue(user);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue(updatedUser);

      const result = await service.update('uuid', dto);

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid' });
      expect(repository.update).toHaveBeenCalledWith('uuid', dto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update('uuid', { name: 'Updated Name' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user and return it', async () => {
      const user = { id: 'uuid', name: 'John Doe', email: 'john@example.com' };
      mockRepository.findOneBy.mockResolvedValue(user);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('uuid');

      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid' });
      expect(repository.delete).toHaveBeenCalledWith('uuid');
      expect(result).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete('uuid')).rejects.toThrow(NotFoundException);
    });
  });
});