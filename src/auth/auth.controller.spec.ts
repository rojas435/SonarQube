import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call service.login and return the result', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password123' };
      const mockResult = { user: { id: 'uuid', email: dto.email }, token: 'jwt-token' };

      mockService.login.mockResolvedValue(mockResult);

      const result = await controller.login(dto);
      expect(result).toEqual(mockResult);
      expect(mockService.login).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });
});