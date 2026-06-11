import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as hashUtils from 'src/utils/hash';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    jest.clearAllMocks();
  });

  describe('register', () => {
    const dto: RegisterDto = {
      name: 'John',
      phone: '01712345678',
      email: 'john@test.com',
      password: 'password123',
    };

    it('should register a new user', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.save.mockResolvedValue({ id: 1, ...dto });

      jest
        .spyOn(hashUtils, 'hashPassword')
        .mockResolvedValue('hashed_password');

      const result = await service.register(dto);

      expect(result.message).toBe('User registered successfully');
      expect(result.user).toBeDefined();
      expect(mockUserRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John',
          password: 'hashed_password',
        }),
      );
    });

    it('should throw if phone already exists', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1 });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw if email already exists', async () => {
      mockUserRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 1 });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateUser', () => {
    const dto: LoginDto = {
      email: 'john@test.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      name: 'John',
      email: 'john@test.com',
      password: 'hashed_password',
      role: 'user',
    };

    it('should validate user with correct credentials', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      jest.spyOn(hashUtils, 'comparePassword').mockResolvedValue(true);

      const result = await service.validateUser(dto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect((result as any).password).toBeUndefined();
    });

    it('should throw if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(service.validateUser(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if password is wrong', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      jest.spyOn(hashUtils, 'comparePassword').mockResolvedValue(false);

      await expect(service.validateUser(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      mockUserRepo.findOne.mockResolvedValue({ id: 1, name: 'John' });

      const result = await service.findById(1);
      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
    });

    it('should return null if not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      const result = await service.findById(999);
      expect(result).toBeNull();
    });
  });
});
