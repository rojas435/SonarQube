import { Test, TestingModule } from '@nestjs/testing';
import { UtilsModule } from './utils.module';
import { PasswordService } from './password.utils';

describe('UtilsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UtilsModule],
    }).compile();
  });

  it('should provide PasswordService', () => {
    const passwordService = module.get<PasswordService>(PasswordService);
    expect(passwordService).toBeDefined();
  });
});