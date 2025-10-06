import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../accounts/user/user.service';
import { PasswordService } from '../utils/password.utils';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../accounts/user/entities/user.entity';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockPasswordService = {
    comparePasswords: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: UserService, useValue: mockUserService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a user and token if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = { id: 'uuid', email, password: 'hashedPassword', role: 'user' };
      const token = 'jwt-token';

      mockUserService.findByEmail.mockResolvedValue(user);
      mockPasswordService.comparePasswords.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(email, password);

      expect(result).toEqual({
        user: { id: user.id, name: undefined, email: user.email, roles: user.role },
        token,
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';

      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(service.login(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = { id: 'uuid', email, password: 'hashedPassword' };

      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockPasswordService.comparePasswords.mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const user = { id: 'uuid', email, password: 'hashedPassword' };

      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockPasswordService.comparePasswords.mockResolvedValue(false);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });
});