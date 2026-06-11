import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hashPassword, comparePassword } from 'src/utils/hash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async register(dto: RegisterDto) {
    const { name, phone, email, password } = dto;

    const phoneExists = await this.userRepo.findOne({
      where: { phone },
    });

    if (phoneExists) {
      throw new BadRequestException('Phone already exists');
    }

    if (email) {
      const emailExists = await this.userRepo.findOne({
        where: { email },
      });

      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }
    }

    const hashedPassword = await hashPassword(password);

    const user = await this.userRepo.save({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }

  async findById(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) return null;
    return user;
  }

  async updateProfile(
    id: number,
    dto: Partial<Pick<UserEntity, 'name' | 'phone' | 'address'>>,
  ) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepo.update(id, dto);
    return this.userRepo.findOne({ where: { id } });
  }

  async validateUser(dto: LoginDto) {
    const { email, password } = dto;

    const findUser = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'phone', 'role'],
    });

    if (!findUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPassMatch = await comparePassword(password, findUser.password);

    if (!isPassMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _password, ...safeUser } = findUser;
    return safeUser;
  }
}
