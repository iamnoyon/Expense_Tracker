import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { hashPassword, comparePassword } from 'src/utils/hash';

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

    const hashedPassword = await hashPassword(password);

    // 💾 save user
    const user = await this.userRepo.save({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    // without password user object
    const { password: _, ...safeUser } = user;

    return {
      message: 'User registered successfully',
      user: safeUser,
    };
  }

  async validateUser(dto: LoginDto) {
    const { email, password } = dto;

    // find user
    const findUser = await this.userRepo.findOne({
      where: { email },
    });

    //user not found handel
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    //password matching
    const isPassMatch = await comparePassword(password, findUser.password);

    //handle incorrect password
    if (!isPassMatch) {
      throw new NotFoundException('Invalid password');
    }

    // without password user object
    const { password: _, ...safeUser } = findUser;

    return safeUser;
  }
}
