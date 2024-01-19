import { hashPassword, checkPassword } from '../bcrypt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSaltSync: jest.fn(() => 'mockedSalt'),
  hash: jest.fn((plain: string, salt: string) => Promise.resolve(`hashed:${plain}:${salt}`)),
  compare: jest.fn((plain: string, hash: string) =>
    Promise.resolve(hash.startsWith(`hashed:${plain}:`)),
  ),
}));

describe('Auth functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hash password', () => {
    it('should hash the password correctly', async () => {
      const hashedPassword = await hashPassword('password');
      expect(hashedPassword).toBe('hashed:password:mockedSalt');
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'mockedSalt');
    });

    it('should reject with an error if hashing fails', async () => {
      // Simulate a rejection from bcrypt.hash
      (bcrypt.hash as jest.Mock).mockRejectedValueOnce(new Error('Hashing failed'));

      await expect(hashPassword('password')).rejects.toThrow('Hashing failed');
      expect(bcrypt.genSaltSync).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'mockedSalt');
    });
  });

  describe('checkPassword', () => {
    it('should return true for correct password', async () => {
      const result = await checkPassword('hashed:password:mockedSalt', 'password');
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed:password:mockedSalt');
    });

    it('should return false for incorrect password', async () => {
      const result = await checkPassword('hashed:wrongpassword:mockedSalt', 'password');
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed:wrongpassword:mockedSalt');
    });

    it('should reject with an error if bcrypt.compare fails', async () => {
      // Simulate a rejection from bcrypt.compare
      (bcrypt.compare as jest.Mock).mockRejectedValueOnce(new Error('Comparison failed'));

      await expect(checkPassword('hashed:password:mockedSalt', 'password')).rejects.toThrow(
        'Comparison failed',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed:password:mockedSalt');
    });
  });
});
