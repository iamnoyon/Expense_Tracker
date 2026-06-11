import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from 'src/user/dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  user_registration(@Body() dto: RegisterDto): any {
    return this.authService.userRegisterService(dto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login a user' })
  userLogin(@Body() dto: LoginDto): any {
    return this.authService.userLoginService(dto);
  }
}
