import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/user/dto/register.dto';
import { LoginDto } from 'src/user/dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    userRegisterService: jest.fn(),
    userLoginService: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('user_registration', () => {
    it('should call authService.userRegisterService', async () => {
      const dto: RegisterDto = {
        name: 'John',
        phone: '01712345678',
        email: 'john@test.com',
        password: 'password123',
      };
      mockAuthService.userRegisterService.mockResolvedValue({
        message: 'User registered successfully',
        user: { id: 1 },
      });

      const result = await controller.user_registration(dto);
      expect(mockAuthService.userRegisterService).toHaveBeenCalledWith(dto);
      expect(result.message).toBe('User registered successfully');
    });
  });

  describe('userLogin', () => {
    it('should set cookies and return user', async () => {
      const dto: LoginDto = {
        email: 'john@test.com',
        password: 'password123',
      };

      mockAuthService.userLoginService.mockResolvedValue({
        user: { id: 1, email: 'john@test.com' },
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });

      const mockRes = {
        cookie: jest.fn(),
      };

      const result = await controller.userLogin(dto, mockRes as any);

      expect(mockAuthService.userLoginService).toHaveBeenCalledWith(dto);
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'access_token',
        'access_token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(result.message).toBe('Login successful');
    });
  });
});
