import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async register(dto: RegisterDto) {
    const { name, phone, email, password } = dto;

    // 🔍 check phone exists
    const phoneExists = await this.userRepo.findOne({
      where: { phone },
    });

    if (phoneExists) {
      throw new BadRequestException('Phone already exists');
    }

    // 🔍 check email exists (if given)
    if (email) {
      const emailExists = await this.userRepo.findOne({
        where: { email },
      });

      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 save user
    const user = await this.userRepo.save({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    // 🚫 remove password from response
    delete user.password;

    return {
      message: 'User registered successfully',
      user,
    };
  }
}
