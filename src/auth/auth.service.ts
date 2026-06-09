import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  userRegisterService(): object {
    return { message: 'Hi' };
  }
}
