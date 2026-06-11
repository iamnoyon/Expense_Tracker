import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from 'src/user/dto/register.dto';
import { LoginDto } from 'src/user/dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    register: jest.fn(),
    validateUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('userRegisterService', () => {
    it('should delegate to userService.register', async () => {
      const dto: RegisterDto = {
        name: 'John',
        phone: '01712345678',
        email: 'john@test.com',
        password: 'password123',
      };
      mockUserService.register.mockResolvedValue({
        message: 'User registered successfully',
        user: { id: 1 },
      });

      const result = await service.userRegisterService(dto);
      expect(mockUserService.register).toHaveBeenCalledWith(dto);
      expect(result.message).toBe('User registered successfully');
    });
  });

  describe('userLoginService', () => {
    const dto: LoginDto = {
      email: 'john@test.com',
      password: 'password123',
    };

    const mockUser = { id: 1, email: 'john@test.com', role: 'user' };

    it('should return tokens on successful login', async () => {
      mockUserService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');

      const result = await service.userLoginService(dto);

      expect(result.user).toEqual(mockUser);
      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
    });
  });
});
