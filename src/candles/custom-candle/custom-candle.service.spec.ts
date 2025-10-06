import { Test, TestingModule } from '@nestjs/testing';
import { CustomCandleService } from './custom-candle.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomCandle } from './entities/custom-candle.entity';
import { Container } from '../container/entities/container.entity';
import { Fragrance } from 'src/fragrance/fragrance/entities/fragrance.entity';
// import { EmotionalState } from 'src/scent_profiles/emotional-state/entities/emotional-state.entity';
import { User } from 'src/accounts/user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('CustomCandleService', () => {
  let service: CustomCandleService;
  let customCandleRepository: jest.Mocked<Repository<CustomCandle>>;
  let containerRepository: jest.Mocked<Repository<Container>>;
  let fragranceRepository: jest.Mocked<Repository<Fragrance>>;
  // let emotionalStateRepository: jest.Mocked<Repository<EmotionalState>>;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomCandleService,
        { provide: getRepositoryToken(CustomCandle), useValue: mockRepository() },
        { provide: getRepositoryToken(Container), useValue: mockRepository() },
        { provide: getRepositoryToken(Fragrance), useValue: mockRepository() },
        // { provide: getRepositoryToken(EmotionalState), useValue: mockRepository() },
        { provide: getRepositoryToken(User), useValue: mockRepository() },
      ],
    }).compile();

    service = module.get<CustomCandleService>(CustomCandleService);
    customCandleRepository = module.get(getRepositoryToken(CustomCandle));
    containerRepository = module.get(getRepositoryToken(Container));
    fragranceRepository = module.get(getRepositoryToken(Fragrance));
    // emotionalStateRepository = module.get(getRepositoryToken(EmotionalState));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new custom candle with a user', async () => {
      const createDto = {
        containerId: 'uuid-container',
        fragranceId: 'uuid-fragrance',
        // emotionalStateId: 'uuid-emotional-state',
        userId: 'uuid-user',
        price: 25.5,
        quantity: 1,
      };
      const mockContainer = { id: 'uuid-container' } as Container;
      const mockFragrance = { id: 'uuid-fragrance' } as Fragrance;
      // const mockEmotionalState = { id: 'uuid-emotional-state' } as EmotionalState;
      const mockUser = { id: 'uuid-user', name: 'Test User' } as User;
      const mockCandle: CustomCandle = {
        id: 'uuid-candle',
        container: mockContainer,
        fragrance: mockFragrance,
        user: mockUser,
        price: createDto.price,
        // createdAt: new Date(),
        customImageUrl: '',
        notes: '',
        name: '',
        status: '',
        qrUrl: '',
      };

      containerRepository.findOne.mockResolvedValue(mockContainer);
      fragranceRepository.findOne.mockResolvedValue(mockFragrance);
      // emotionalStateRepository.findOne.mockResolvedValue(mockEmotionalState);
      userRepository.findOne.mockResolvedValue(mockUser);
      customCandleRepository.create.mockReturnValue(mockCandle);
      customCandleRepository.save.mockResolvedValue(mockCandle);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCandle);
      expect(containerRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-container' } });
      expect(fragranceRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-fragrance' } });
      // expect(emotionalStateRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-emotional-state' } });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-user' } });
      expect(customCandleRepository.create).toHaveBeenCalledWith({
        price: createDto.price,
        quantity: createDto.quantity,
        container: mockContainer,
        fragrance: mockFragrance,
        // emotionalState: mockEmotionalState,
        user: mockUser,
      });
      expect(customCandleRepository.save).toHaveBeenCalledWith(mockCandle);
    });

    it('should throw an error if user is not found', async () => {
      const createDto = {
        containerId: 'uuid-container',
        fragranceId: 'uuid-fragrance',
        // emotionalStateId: 'uuid-emotional-state',
        userId: 'uuid-user',
        price: 25.5,
        quantity: 1,
      };
      const mockContainer = { id: 'uuid-container' } as Container;
      const mockFragrance = { id: 'uuid-fragrance' } as Fragrance;
      // const mockEmotionalState = { id: 'uuid-emotional-state' } as EmotionalState;

      containerRepository.findOne.mockResolvedValue(mockContainer);
      fragranceRepository.findOne.mockResolvedValue(mockFragrance);
      // emotionalStateRepository.findOne.mockResolvedValue(mockEmotionalState);
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow('User with id uuid-user not found');
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-user' } });
    });

    it('should throw an error if fragrance is not found', async () => {
      const createDto = {
        containerId: 'uuid-container',
        fragranceId: 'uuid-fragrance',
        // emotionalStateId: 'uuid-emotional-state',
        userId: 'uuid-user',
        price: 25.5,
        quantity: 1,
      };
      const mockContainer = { id: 'uuid-container' } as Container;
    
      containerRepository.findOne.mockResolvedValue(mockContainer);
      fragranceRepository.findOne.mockResolvedValue(null);
    
      await expect(service.create(createDto)).rejects.toThrow('Fragrance with id uuid-fragrance not found');
      expect(fragranceRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-fragrance' } });
    });

    // it('should throw an error if emotional state is not found', async () => {
    //   const createDto = {
    //     containerId: 'uuid-container',
    //     fragranceId: 'uuid-fragrance',
    //     emotionalStateId: 'uuid-emotional-state',
    //     userId: 'uuid-user',
    //     price: 25.5,
    //     quantity: 1,
    //   };
    //   const mockContainer = { id: 'uuid-container' } as Container;
    //   const mockFragrance = { id: 'uuid-fragrance' } as Fragrance;
    
    //   containerRepository.findOne.mockResolvedValue(mockContainer);
    //   fragranceRepository.findOne.mockResolvedValue(mockFragrance);
    //   emotionalStateRepository.findOne.mockResolvedValue(null);
    
    //   await expect(service.create(createDto)).rejects.toThrow('EmotionalState with id uuid-emotional-state not found');
    //   expect(emotionalStateRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-emotional-state' } });
    // });

    // it('should throw an error if emotional state is not found', async () => {
    //   const createDto = {
    //     containerId: 'uuid-container',
    //     fragranceId: 'uuid-fragrance',
    //     emotionalStateId: 'uuid-emotional-state',
    //     userId: 'uuid-user',
    //     price: 25.5,
    //     quantity: 1,
    //   };
    //   const mockContainer = { id: 'uuid-container' } as Container;
    //   const mockFragrance = { id: 'uuid-fragrance' } as Fragrance;
    
    //   containerRepository.findOne.mockResolvedValue(mockContainer);
    //   fragranceRepository.findOne.mockResolvedValue(mockFragrance);
    //   emotionalStateRepository.findOne.mockResolvedValue(null);
    
    //   await expect(service.create(createDto)).rejects.toThrow('EmotionalState with id uuid-emotional-state not found');
    //   expect(emotionalStateRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-emotional-state' } });
    // });

    it('should throw an error if container to update is not found', async () => {
      const updateDto = { containerId: 'uuid-container' };
      const mockCandle = { id: 'uuid-candle', name: 'Candle 1' } as CustomCandle;
    
      customCandleRepository.findOne.mockResolvedValue(mockCandle);
      containerRepository.findOne.mockResolvedValue(null);
    
      await expect(service.update('uuid-candle', updateDto)).rejects.toThrow('Container with id uuid-container not found');
      expect(containerRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-container' } });
    });

    it('should throw an error if fragrance to update is not found', async () => {
      const updateDto = { fragranceId: 'uuid-fragrance' };
      const mockCandle = { id: 'uuid-candle', name: 'Candle 1' } as CustomCandle;
    
      customCandleRepository.findOne.mockResolvedValue(mockCandle);
      fragranceRepository.findOne.mockResolvedValue(null);
    
      await expect(service.update('uuid-candle', updateDto)).rejects.toThrow('Fragrance with id uuid-fragrance not found');
      expect(fragranceRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-fragrance' } });
    });

    // it('should throw an error if emotional state to update is not found', async () => {
    //   const updateDto = { emotionalStateId: 'uuid-emotional-state' };
    //   const mockCandle = { id: 'uuid-candle', name: 'Candle 1' } as CustomCandle;
    
    //   customCandleRepository.findOne.mockResolvedValue(mockCandle);
    //   emotionalStateRepository.findOne.mockResolvedValue(null);
    
    //   await expect(service.update('uuid-candle', updateDto)).rejects.toThrow('EmotionalState with id uuid-emotional-state not found');
    //   expect(emotionalStateRepository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-emotional-state' } });
    // });

    it('should update a custom candle successfully', async () => {
      const updateDto = { name: 'Updated Candle', price: 30.0 };
      const mockCandle = { id: 'uuid-candle', name: 'Candle 1', price: 25.0 } as CustomCandle;
    
      customCandleRepository.findOne.mockResolvedValue(mockCandle);
      customCandleRepository.save.mockResolvedValue({ ...mockCandle, ...updateDto });
    
      const result = await service.update('uuid-candle', updateDto);
    
      expect(result).toEqual({ ...mockCandle, ...updateDto });
      expect(customCandleRepository.save).toHaveBeenCalledWith({ ...mockCandle, ...updateDto });
    });
  });

  describe('findAll', () => {
    it('should return all custom candles', async () => {
      const mockCandles = [
        { id: 'uuid-candle-1', name: 'Candle 1' } as CustomCandle,
        { id: 'uuid-candle-2', name: 'Candle 2' } as CustomCandle,
      ];

      customCandleRepository.find.mockResolvedValue(mockCandles);

      const result = await service.findAll();

      expect(result).toEqual(mockCandles);
      expect(customCandleRepository.find).toHaveBeenCalledWith({ relations: ['user', 'container', 'fragrance'] });
    });
  });

  describe('findOne', () => {
    it('should return a custom candle by ID', async () => {
      const mockCandle = { id: 'uuid-candle', name: 'Candle 1' } as CustomCandle;

      customCandleRepository.findOne.mockResolvedValue(mockCandle);

      const result = await service.findOne('uuid-candle');

      expect(result).toEqual(mockCandle);
      expect(customCandleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-candle' },
        relations: ['user', 'container', 'fragrance'],
      });
    });

    it('should throw an error if custom candle is not found', async () => {
      customCandleRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid-candle')).rejects.toThrow('CustomCandle with id uuid-candle not found');
      expect(customCandleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-candle' },
        relations: ['user', 'container', 'fragrance'],
      });
    });
  });

  describe('remove', () => {
    it('should remove a custom candle', async () => {
      const mockCandle = { id: 'uuid-candle', name: 'Candle to Delete' } as CustomCandle;

      customCandleRepository.findOne.mockResolvedValue(mockCandle);
      customCandleRepository.remove.mockResolvedValue(mockCandle);

      const result = await service.remove('uuid-candle');

      expect(result).toEqual(mockCandle);
      expect(customCandleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-candle' },
        relations: ['user', 'container', 'fragrance'],
      });
      expect(customCandleRepository.remove).toHaveBeenCalledWith(mockCandle);
    });

    it('should throw an error if custom candle to remove is not found', async () => {
      customCandleRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('uuid-candle')).rejects.toThrow('CustomCandle with id uuid-candle not found');
    });
  });
});