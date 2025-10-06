import { PasswordService } from './password.utils';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  describe('hashPassword', () => {
    it('should hash a plain text password', async () => {
      const password = 'plainPassword';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(password);
    });
  });

  describe('comparePasswords', () => {
    it('should return true if passwords match', async () => {
      const password = 'plainPassword';
      const hashedPassword = await service.hashPassword(password);

      const result = await service.comparePasswords(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      const password = 'plainPassword';
      const hashedPassword = await service.hashPassword(password);

      const result = await service.comparePasswords('wrongPassword', hashedPassword);
      expect(result).toBe(false);
    });
  });
});