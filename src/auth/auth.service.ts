import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto, RegisterDto } from 'src/user/dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  userRegisterService(dto: RegisterDto): any {
    return this.userService.register(dto);
  }

  async userLoginService(dto: LoginDto) {
    const user = await this.userService.validateUser(dto);

    // token payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Token generate
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
