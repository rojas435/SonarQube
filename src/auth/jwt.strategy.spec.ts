import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy({ get: jest.fn().mockReturnValue('secret') } as any);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate the payload', async () => {
    const payload = { id: 'uuid', email: 'test@example.com', role: 'user' };
    const result = await strategy.validate(payload);

    expect(result).toEqual(payload);
  });
});