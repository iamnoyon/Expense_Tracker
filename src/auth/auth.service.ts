import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto, RegisterDto } from 'src/user/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  userRegisterService(dto: RegisterDto): any {
    return this.userService.register(dto);
  }

  userLoginService(dto: LoginDto): any {
    return this.userService.login(dto);
  }
}
